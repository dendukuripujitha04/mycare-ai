import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'ADMIN']).optional().default('USER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const symptomAnalysisSchema = z.object({
  symptoms: z.string().min(3, 'Please describe your symptoms in detail'),
  age: z.number().min(1, 'Age must be at least 1').max(120, 'Please enter a valid age'),
  gender: z.string().min(1, 'Gender is required'),
  duration: z.string().min(1, 'Duration is required'),
  severity: z.enum(['Mild', 'Moderate', 'Severe', 'Critical']),
  additionalInfo: z.string().optional(),
});

export const appointmentBookingSchema = z.object({
  name: z.string().min(2, 'Your name must be at least 2 characters'),
  doctorId: z.string().min(1, 'Please select a doctor'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  appointmentDate: z.string().min(1, 'Please select a date'),
  appointmentTime: z.string().min(1, 'Please select a time slot'),
  reason: z.string().min(3, 'Please specify reason for visit'),
  notes: z.string().optional(),
});

export const doctorSchema = z.object({
  name: z.string().min(2, 'Doctor name is required'),
  specialization: z.string().min(2, 'Specialization is required'),
  experience: z.string().min(1, 'Experience is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  phone: z.string().min(10, 'Phone number is required'),
  email: z.string().email('Valid email is required'),
  clinicName: z.string().min(2, 'Clinic name is required'),
  clinicAddress: z.string().min(5, 'Clinic address is required'),
  availableDays: z.string().min(2, 'Available days are required'),
  availableFrom: z.string().min(1, 'Available from time is required'),
  availableTo: z.string().min(1, 'Available to time is required'),
  imageUrl: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
});
