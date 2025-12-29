import { Target, Users, Lightbulb, Heart, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We encourage creative thinking and developing innovative solutions to real-world challenges.',
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for the highest standards in everything we do, pushing boundaries and exceeding expectations.',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and knowledge sharing to achieve greater impact.',
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'We operate with honesty, transparency, and ethical principles in all our interactions.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Participants' },
    { value: '50+', label: 'Projects' },
    { value: '20+', label: 'Mentors' },
    { value: '5', label: 'Events' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Syria Vision</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Empowering Syrian youth to build a better future through innovation, 
            collaboration, and creative solutions.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
                Our Mission
              </span>
              <h2 className="section-title mb-6">Building Tomorrow's Leaders</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Syria Vision is an annual event that brings together ambitious Syrian youth 
                to develop creative projects and solutions that contribute to building a better future.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We provide a platform for young innovators to learn, collaborate, and transform 
                their ideas into reality. Through mentorship, workshops, and hands-on experience, 
                we help participants develop the skills they need to become leaders in their communities.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="card text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
              Our Values
            </span>
            <h2 className="section-title">What We Stand For</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center hover:-translate-y-2">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-3xl p-12 text-white text-center">
            <Globe className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              To create a generation of Syrian innovators and leaders who are equipped 
              with the skills, knowledge, and network to drive positive change in their 
              communities and contribute to Syria's prosperity.
            </p>
          </div>
        </div>
      </section>

      {/* Competition Fields */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
              Competition Fields
            </span>
            <h2 className="section-title">Areas of Innovation</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Technology & AI', desc: 'Software, apps, and digital solutions' },
              { title: 'Healthcare', desc: 'Medical innovations and health tech' },
              { title: 'Education', desc: 'EdTech and learning solutions' },
              { title: 'Environment', desc: 'Sustainability and green initiatives' },
              { title: 'Business', desc: 'Startups and social enterprises' },
              { title: 'Social Impact', desc: 'Community-driven projects' },
            ].map((field, index) => (
              <div key={index} className="card flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{field.title}</h3>
                  <p className="text-gray-600 text-sm">{field.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Movement</h2>
          <p className="text-gray-400 text-lg mb-8">
            Be part of Syria's future. Register for our upcoming events and start your journey.
          </p>
          <a href="/events" className="btn-primary inline-block">
            Explore Events
          </a>
        </div>
      </section>
    </div>
  );
}
