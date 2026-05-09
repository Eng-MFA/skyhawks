const { Spec, Stat } = require('./models/Engineering')
const Team = require('./models/Team')
const Achievement = require('./models/Achievement')
const Sponsor = require('./models/Sponsor')
const { ContactInfo } = require('./models/Contact')

module.exports = async function seed() {
  // Engineering Specs
  await Spec.insertMany([
    {
      part: 'propellers', icon: '✈️', title: 'Wings', order: 0,
      description: 'High-aspect ratio composite wings with optimized airfoil for maximum lift-to-drag ratio',
      details: [
        { label: 'Material', value: 'Carbon Fiber' },
        { label: 'Span', value: '2.4m' },
        { label: 'Airfoil', value: 'NACA 2412' },
        { label: 'Config', value: 'Swept' },
      ],
    },
    {
      part: 'motors', icon: '🔧', title: 'Tail Assembly', order: 1,
      description: 'Precision-engineered empennage with fully actuated control surfaces',
      details: [
        { label: 'Type', value: 'T-Tail' },
        { label: 'Servo', value: 'Digital' },
        { label: 'Material', value: 'Balsa/CF' },
        { label: 'Deflection', value: '±30°' },
      ],
    },
    {
      part: 'frame', icon: '🛡️', title: 'Fuselage', order: 2,
      description: 'Aerodynamic monocoque fuselage with integrated avionics bay and payload compartment',
      details: [
        { label: 'Material', value: '3K Carbon' },
        { label: 'Weight', value: '850g' },
        { label: 'Length', value: '1.2m' },
        { label: 'Payload', value: '2kg max' },
      ],
    },
    {
      part: 'battery', icon: '🔋', title: 'Power System', order: 3,
      description: 'High-efficiency pusher propulsion with brushless motor and optimized LiPo pack',
      details: [
        { label: 'Motor', value: 'Brushless' },
        { label: 'Battery', value: '4S 5200mAh' },
        { label: 'Endurance', value: '45 min' },
        { label: 'Propeller', value: '12×6 APC' },
      ],
    },
  ])

  // Stats
  await Stat.insertMany([
    { value: '3.5 kg', label: 'Total Weight', color: '#C9A87C', order: 0 },
    { value: '120 km/h', label: 'Cruise Speed', color: '#4A9EBF', order: 1 },
    { value: '45 min', label: 'Endurance', color: '#D4A843', order: 2 },
    { value: '2 km', label: 'Range', color: '#C47A52', order: 3 },
  ])

  // Team
  await Team.insertMany([
    { name: 'Ahmed Hassan', role: 'Team Lead', roleClass: 'role-lead', initials: 'AH', description: 'Oversees all operations and competition strategy', order: 0 },
    { name: 'Sarah Chen', role: 'Mechanical', roleClass: 'role-mechanical', initials: 'SC', description: 'Frame design and aerodynamics optimization', order: 1 },
    { name: 'Omar Khalil', role: 'Electrical', roleClass: 'role-electrical', initials: 'OK', description: 'Power systems and flight controller integration', order: 2 },
    { name: 'Lina Park', role: 'Software', roleClass: 'role-software', initials: 'LP', description: 'Autonomous flight algorithms and CV', order: 3 },
    { name: 'Yusuf Abdi', role: 'Mechanical', roleClass: 'role-mechanical', initials: 'YA', description: '3D printing and rapid prototyping lead', order: 4 },
    { name: 'Maya Torres', role: 'Electrical', roleClass: 'role-electrical', initials: 'MT', description: 'ESC tuning and motor optimization specialist', order: 5 },
    { name: 'Daniel Okafor', role: 'Software', roleClass: 'role-software', initials: 'DO', description: 'Ground station and telemetry systems', order: 6 },
    { name: 'Fatima Al-Rashid', role: 'Lead', roleClass: 'role-lead', initials: 'FA', description: 'Competition pilot and team coordinator', order: 7 },
  ])

  // Achievements
  await Achievement.insertMany([
    { year: '2024', title: 'International Drone Racing Championship', description: '1st Place — Autonomous category. Fastest lap time of 42.3 seconds.', award: '🥇 Gold Medal', color: '#C47A52', order: 0 },
    { year: '2024', title: 'IEEE Robotics Competition', description: 'Best Innovation Award for our custom flight controller design.', award: '🏆 Innovation Award', color: '#C9A87C', order: 1 },
    { year: '2023', title: 'National STEM Expo', description: 'Featured project, showcasing autonomous delivery drone prototype.', award: '⭐ Featured Project', color: '#D4A843', order: 2 },
    { year: '2023', title: 'SAE Aero Design', description: '2nd Place overall. Highest payload-to-weight ratio in competition history.', award: '🥈 Silver Medal', color: '#4A9EBF', order: 3 },
    { year: '2022', title: 'University Innovation Grant', description: 'Awarded $25,000 for autonomous drone research and development.', award: '💰 Research Grant', color: '#C47A52', order: 4 },
    { year: '2022', title: 'Regional Drone Freestyle', description: '3rd Place — Team freestyle. Crowd-voted fan favorite performance.', award: '🥉 Bronze + Fan Favorite', color: '#C9A87C', order: 5 },
  ])

  // Sponsors
  await Sponsor.insertMany([
    { name: 'TechCorp', tier: 'Platinum', color: '#C9A87C', icon: '💎', order: 0 },
    { name: 'AeroSystems', tier: 'Gold', color: '#D4A843', icon: '✈️', order: 1 },
    { name: 'PowerCell Labs', tier: 'Gold', color: '#D4A843', icon: '🔋', order: 2 },
    { name: 'DronePort', tier: 'Silver', color: '#9CA3AF', icon: '🛸', order: 3 },
    { name: 'QuantumMotors', tier: 'Silver', color: '#9CA3AF', icon: '⚡', order: 4 },
    { name: 'FPV Vision', tier: 'Silver', color: '#9CA3AF', icon: '📡', order: 5 },
    { name: 'CarbonTech', tier: 'Bronze', color: '#C47A52', icon: '🔩', order: 6 },
    { name: 'University R&D', tier: 'Partner', color: '#4A9EBF', icon: '🎓', order: 7 },
  ])

  // Contact Info
  await ContactInfo.create({
    email: 'team@skyhawks.edu',
    phone: '+1 (555) 0123-4567',
    location: 'Engineering Building, Room 405',
    instagram: '',
    twitter: '',
    youtube: '',
    linkedin: '',
  })
}
