-- Location: supabase/migrations/20250108095243_clinic_front_desk_system.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete new clinic front desk system
-- Dependencies: New auth-enabled system with complete front desk functionality

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'front_desk_staff');
CREATE TYPE public.doctor_specialization AS ENUM (
  'general_practice', 'pediatrics', 'cardiology', 'dermatology', 
  'orthopedics', 'gynecology', 'ophthalmology', 'psychiatry', 
  'neurology', 'surgery', 'emergency_medicine'
);
CREATE TYPE public.appointment_status AS ENUM ('booked', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE public.queue_status AS ENUM ('waiting', 'with_doctor', 'completed', 'cancelled');
CREATE TYPE public.doctor_availability_status AS ENUM ('available', 'busy', 'on_break', 'unavailable');

-- 2. Core Tables (no foreign keys)

-- User profiles table (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'front_desk_staff'::public.user_role,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    specialization public.doctor_specialization NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    phone TEXT,
    email TEXT,
    location TEXT,
    is_available BOOLEAN DEFAULT true,
    availability_status public.doctor_availability_status DEFAULT 'available'::public.doctor_availability_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Dependent Tables (with foreign keys)

-- Doctor availability schedules
CREATE TABLE public.doctor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status public.appointment_status DEFAULT 'booked'::public.appointment_status,
    notes TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Patient queue table (for walk-in patients)
CREATE TABLE public.patient_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    queue_number INTEGER NOT NULL,
    status public.queue_status DEFAULT 'waiting'::public.queue_status,
    check_in_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    called_time TIMESTAMPTZ,
    completed_time TIMESTAMPTZ,
    priority_level INTEGER DEFAULT 1, -- 1=normal, 2=high, 3=urgent
    notes TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Patient visit history
CREATE TABLE public.patient_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    queue_id UUID REFERENCES public.patient_queue(id) ON DELETE SET NULL,
    visit_type TEXT CHECK (visit_type IN ('appointment', 'walk_in')),
    visit_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    follow_up_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_doctors_specialization ON public.doctors(specialization);
CREATE INDEX idx_doctors_availability_status ON public.doctors(availability_status);
CREATE INDEX idx_patients_phone ON public.patients(phone);
CREATE INDEX idx_patients_name ON public.patients(full_name);
CREATE INDEX idx_doctor_availability_doctor_id ON public.doctor_availability(doctor_id);
CREATE INDEX idx_doctor_availability_day_time ON public.doctor_availability(day_of_week, start_time, end_time);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_date_time ON public.appointments(appointment_date, appointment_time);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_patient_queue_doctor_id ON public.patient_queue(doctor_id);
CREATE INDEX idx_patient_queue_status ON public.patient_queue(status);
CREATE INDEX idx_patient_queue_number ON public.patient_queue(queue_number);
CREATE INDEX idx_patient_visits_patient_id ON public.patient_visits(patient_id);
CREATE INDEX idx_patient_visits_doctor_id ON public.patient_visits(doctor_id);

-- 5. Functions (must be created before RLS policies)

-- Function to get next queue number
CREATE OR REPLACE FUNCTION public.get_next_queue_number()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT COALESCE(MAX(queue_number), 0) + 1
FROM public.patient_queue 
WHERE DATE(check_in_time) = CURRENT_DATE
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
)
$$;

-- Function to check if user is front desk staff
CREATE OR REPLACE FUNCTION public.is_front_desk_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('admin'::public.user_role, 'front_desk_staff'::public.user_role)
    AND up.is_active = true
)
$$;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Function for automatic user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'front_desk_staff')::public.user_role
  );  
  RETURN NEW;
END;
$$;

-- 6. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_visits ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies (using correct patterns)

-- Pattern 1: Core user table - simple ownership only
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 5: Staff-only access with user validation
-- Doctors table - only front desk staff can manage
CREATE POLICY "staff_manage_doctors"
ON public.doctors
FOR ALL
TO authenticated
USING (public.is_front_desk_staff())
WITH CHECK (public.is_front_desk_staff());

-- Patients table - only front desk staff can manage
CREATE POLICY "staff_manage_patients"
ON public.patients
FOR ALL
TO authenticated
USING (public.is_front_desk_staff())
WITH CHECK (public.is_front_desk_staff());

-- Doctor availability - only front desk staff can manage
CREATE POLICY "staff_manage_doctor_availability"
ON public.doctor_availability
FOR ALL
TO authenticated
USING (public.is_front_desk_staff())
WITH CHECK (public.is_front_desk_staff());

-- Appointments - only front desk staff can manage
CREATE POLICY "staff_manage_appointments"
ON public.appointments
FOR ALL
TO authenticated
USING (public.is_front_desk_staff())
WITH CHECK (public.is_front_desk_staff());

-- Patient queue - only front desk staff can manage
CREATE POLICY "staff_manage_patient_queue"
ON public.patient_queue
FOR ALL
TO authenticated
USING (public.is_front_desk_staff())
WITH CHECK (public.is_front_desk_staff());

-- Patient visits - only front desk staff can manage
CREATE POLICY "staff_manage_patient_visits"
ON public.patient_visits
FOR ALL
TO authenticated
USING (public.is_front_desk_staff())
WITH CHECK (public.is_front_desk_staff());

-- 8. Triggers
-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
    BEFORE UPDATE ON public.doctors
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_availability_updated_at
    BEFORE UPDATE ON public.doctor_availability
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_queue_updated_at
    BEFORE UPDATE ON public.patient_queue
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Mock Data for Testing
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    staff_uuid UUID := gen_random_uuid();
    doctor1_id UUID := gen_random_uuid();
    doctor2_id UUID := gen_random_uuid();
    doctor3_id UUID := gen_random_uuid();
    patient1_id UUID := gen_random_uuid();
    patient2_id UUID := gen_random_uuid();
    patient3_id UUID := gen_random_uuid();
    appointment1_id UUID := gen_random_uuid();
    appointment2_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@clinic.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Clinic Administrator", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (staff_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'frontdesk@clinic.com', crypt('staff123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Front Desk Staff", "role": "front_desk_staff"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create doctors
    INSERT INTO public.doctors (id, full_name, specialization, gender, phone, email, location) VALUES
        (doctor1_id, 'Dr. Sarah Johnson', 'general_practice', 'female', '+1234567890', 'sarah.johnson@clinic.com', 'Room 101'),
        (doctor2_id, 'Dr. Michael Chen', 'pediatrics', 'male', '+1234567891', 'michael.chen@clinic.com', 'Room 102'),
        (doctor3_id, 'Dr. Emily Rodriguez', 'cardiology', 'female', '+1234567892', 'emily.rodriguez@clinic.com', 'Room 201');

    -- Create doctor availability (sample schedules)
    INSERT INTO public.doctor_availability (doctor_id, day_of_week, start_time, end_time) VALUES
        -- Dr. Sarah Johnson - Monday to Friday 9 AM to 5 PM
        (doctor1_id, 1, '09:00', '17:00'),
        (doctor1_id, 2, '09:00', '17:00'),
        (doctor1_id, 3, '09:00', '17:00'),
        (doctor1_id, 4, '09:00', '17:00'),
        (doctor1_id, 5, '09:00', '17:00'),
        -- Dr. Michael Chen - Tuesday to Saturday 10 AM to 6 PM
        (doctor2_id, 2, '10:00', '18:00'),
        (doctor2_id, 3, '10:00', '18:00'),
        (doctor2_id, 4, '10:00', '18:00'),
        (doctor2_id, 5, '10:00', '18:00'),
        (doctor2_id, 6, '10:00', '18:00'),
        -- Dr. Emily Rodriguez - Monday to Thursday 8 AM to 4 PM
        (doctor3_id, 1, '08:00', '16:00'),
        (doctor3_id, 2, '08:00', '16:00'),
        (doctor3_id, 3, '08:00', '16:00'),
        (doctor3_id, 4, '08:00', '16:00');

    -- Create patients
    INSERT INTO public.patients (id, full_name, phone, email, date_of_birth, gender, address) VALUES
        (patient1_id, 'John Smith', '+1987654321', 'john.smith@email.com', '1985-06-15', 'male', '123 Main St, City, State 12345'),
        (patient2_id, 'Mary Johnson', '+1987654322', 'mary.johnson@email.com', '1990-03-22', 'female', '456 Oak Ave, City, State 12346'),
        (patient3_id, 'Robert Brown', '+1987654323', 'robert.brown@email.com', '1975-11-08', 'male', '789 Pine Rd, City, State 12347');

    -- Create appointments
    INSERT INTO public.appointments (id, patient_id, doctor_id, appointment_date, appointment_time, status, created_by) VALUES
        (appointment1_id, patient1_id, doctor1_id, CURRENT_DATE + INTERVAL '1 day', '10:00', 'booked', admin_uuid),
        (appointment2_id, patient2_id, doctor2_id, CURRENT_DATE + INTERVAL '2 days', '14:30', 'confirmed', staff_uuid);

    -- Create queue entries (walk-in patients)
    INSERT INTO public.patient_queue (patient_id, doctor_id, queue_number, status, created_by) VALUES
        (patient3_id, doctor1_id, 1, 'waiting', staff_uuid);

    -- Create sample visit history
    INSERT INTO public.patient_visits (patient_id, doctor_id, visit_type, diagnosis, treatment) VALUES
        (patient1_id, doctor1_id, 'appointment', 'Annual checkup', 'Routine examination completed'),
        (patient2_id, doctor2_id, 'walk_in', 'Common cold', 'Prescribed rest and medication');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;