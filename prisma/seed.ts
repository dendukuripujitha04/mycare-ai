import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Medicare AI database...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('User@123', 10);

  // 1. Seed Users (Admin & User)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medicare.ai' },
    update: {},
    create: {
      name: 'Dr. Medicare Admin',
      email: 'admin@medicare.ai',
      phone: '+919876543210',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'user@medicare.ai' },
    update: {},
    create: {
      name: 'Rahul Sharma',
      email: 'user@medicare.ai',
      phone: '+919876543211',
      passwordHash: userPassword,
      role: 'USER',
    },
  });

  console.log('Users seeded:', { admin: admin.email, user: demoUser.email });

  // 2. Seed Doctors
  const doctorsData = [
    {
      name: 'Dr. Ananya Rao',
      specialization: 'General Physician',
      experience: '12 Years',
      qualification: 'MBBS, MD (Internal Medicine)',
      phone: '+919812345671',
      email: 'ananya.rao@medicare.ai',
      clinicName: 'Apollo Care Center',
      clinicAddress: 'Road No. 12, Jubilee Hills, Hyderabad',
      availableDays: 'Mon, Tue, Wed, Thu, Fri, Sat',
      availableFrom: '09:00 AM',
      availableTo: '01:00 PM',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Dr. Rahul Sharma',
      specialization: 'Cardiologist',
      experience: '16 Years',
      qualification: 'MBBS, MD, DM (Cardiology), FACC',
      phone: '+919812345672',
      email: 'rahul.sharma@medicare.ai',
      clinicName: 'Heart Care Specialty Hospital',
      clinicAddress: 'Banjara Hills Main Road, Hyderabad',
      availableDays: 'Mon, Wed, Fri, Sat',
      availableFrom: '10:00 AM',
      availableTo: '04:00 PM',
      imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Dr. Priya Reddy',
      specialization: 'Dermatologist',
      experience: '9 Years',
      qualification: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
      phone: '+919812345673',
      email: 'priya.reddy@medicare.ai',
      clinicName: 'DermaGlow Skin & Hair Clinic',
      clinicAddress: 'Madhapur Metro Pillar 17, Hyderabad',
      availableDays: 'Tue, Thu, Fri, Sat',
      availableFrom: '11:00 AM',
      availableTo: '05:00 PM',
      imageUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78964?w=400&q=80',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Dr. Arjun Kumar',
      specialization: 'Orthopedic',
      experience: '14 Years',
      qualification: 'MBBS, MS (Orthopedics), M.Ch (UK)',
      phone: '+919812345674',
      email: 'arjun.kumar@medicare.ai',
      clinicName: 'Bone & Joint Institute',
      clinicAddress: 'Hitec City Phase 2, Hyderabad',
      availableDays: 'Mon, Tue, Thu, Sat',
      availableFrom: '09:30 AM',
      availableTo: '02:30 PM',
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Dr. Sneha Patel',
      specialization: 'Pediatrician',
      experience: '11 Years',
      qualification: 'MBBS, DCH, MD (Pediatrics)',
      phone: '+919812345675',
      email: 'sneha.patel@medicare.ai',
      clinicName: 'Little Angels Child Care',
      clinicAddress: 'Kondapur Main Road, Hyderabad',
      availableDays: 'Mon, Tue, Wed, Thu, Fri, Sat',
      availableFrom: '10:00 AM',
      availableTo: '06:00 PM',
      imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Dr. Rajesh Verma',
      specialization: 'ENT Specialist',
      experience: '13 Years',
      qualification: 'MBBS, MS (ENT), DNB',
      phone: '+919812345676',
      email: 'rajesh.verma@medicare.ai',
      clinicName: 'Clear Ear Nose & Throat Care',
      clinicAddress: 'Gachibowli Ring Road, Hyderabad',
      availableDays: 'Mon, Wed, Fri',
      availableFrom: '02:00 PM',
      availableTo: '07:00 PM',
      imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Dr. Meera Joshi',
      specialization: 'Gynecologist',
      experience: '15 Years',
      qualification: 'MBBS, MD (Obstetrics & Gynecology), DGO',
      phone: '+919812345677',
      email: 'meera.joshi@medicare.ai',
      clinicName: 'Woman Care Specialty Clinic',
      clinicAddress: 'Kukatpally Housing Board, Hyderabad',
      availableDays: 'Mon, Tue, Thu, Fri, Sat',
      availableFrom: '09:00 AM',
      availableTo: '03:00 PM',
      imageUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&q=80',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Dr. Vikram Malhotra',
      specialization: 'Neurologist',
      experience: '18 Years',
      qualification: 'MBBS, MD (Medicine), DM (Neurology)',
      phone: '+919812345678',
      email: 'vikram.malhotra@medicare.ai',
      clinicName: 'Brain & Spine Neuro Center',
      clinicAddress: 'Begumpet Airport Road, Hyderabad',
      availableDays: 'Tue, Wed, Sat',
      availableFrom: '10:00 AM',
      availableTo: '03:00 PM',
      imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=400&q=80',
      status: 'ACTIVE' as const,
    },
  ];

  for (const doc of doctorsData) {
    await prisma.doctor.upsert({
      where: { id: doc.email }, // temporary key check
      update: doc,
      create: doc,
    }).catch(async () => {
      // fallback create if upsert by email fails
      const existing = await prisma.doctor.findFirst({ where: { email: doc.email } });
      if (!existing) {
        await prisma.doctor.create({ data: doc });
      }
    });
  }

  console.log(`Seeded ${doctorsData.length} sample doctors successfully.`);

  // 3. Seed a sample appointment for demo user
  const sampleDoc = await prisma.doctor.findFirst({ where: { specialization: 'General Physician' } });
  if (sampleDoc) {
    const existingAppt = await prisma.appointment.findFirst({ where: { userId: demoUser.id } });
    if (!existingAppt) {
      const appt = await prisma.appointment.create({
        data: {
          appointmentNumber: `MCA-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: demoUser.id,
          doctorId: sampleDoc.id,
          appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          appointmentTime: '10:30 AM',
          reason: 'Routine health checkup & minor seasonal fatigue',
          status: 'UPCOMING',
        },
      });

      await prisma.voiceCall.create({
        data: {
          appointmentId: appt.id,
          userId: demoUser.id,
          phoneNumber: demoUser.phone,
          status: 'INITIATED',
          language: 'en',
        },
      });
      console.log('Sample appointment seeded:', appt.appointmentNumber);
    }
  }

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
