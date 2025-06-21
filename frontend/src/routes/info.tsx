import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/info')({
  component: HeroPage,
})

export function HeroPage() {
  return (
    <div className='min-h-screen bg-c-background'>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  )
}

function Navbar() {
  return (
    <nav className='bg-c-nav border-b border-c-border'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <div className='flex-shrink-0 flex items-center'>
            <span className='text-2xl mr-2'>🚀</span>
            <span className='ml-1 text-xl font-bold text-c-text'>Pravah</span>
          </div>
          <div>
            <Link
              to='/auth/login'
              className='btn btn-primary bg-c-accent hover:bg-c-accent-hover border-none text-white'
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <div className='relative'>
      {/* Content Section - Always on top */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='pt-10 pb-8 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20 xl:pt-20'>
          <div className='text-center lg:text-left'>
            <h1 className='text-4xl tracking-tight font-extrabold text-c-text sm:text-5xl md:text-6xl'>
              <span className='block'>Build unstoppable</span>
              <span className='block text-c-primary'>Momentum</span>
            </h1>
            <p className='mt-3 text-base text-c-text-muted sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0'>
              Pravah helps you track daily habits and build lasting momentum toward your goals.
            </p>
            <div className='mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-3'>
              <Link
                to='/auth/signup'
                className='btn btn-primary px-8 py-3 text-base font-medium text-white bg-c-accent hover:bg-c-accent-hover md:py-4 md:text-lg md:px-10 border-none'
              >
                Start Building 🚀
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section - Below on mobile, beside on desktop */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-center pb-12 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:items-center lg:pb-0'>
          <div className='w-full max-w-md'>
            <div className='mockup-window border border-c-border bg-c-surface p-4 sm:p-6'>
              <div className='grid grid-cols-7 gap-1 text-sm'>
                {Array.from({ length: 35 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-sm ${
                      i % 8 === 0
                        ? 'bg-c-goal-miss'
                        : i % 5 === 0
                        ? 'bg-c-goal-a'
                        : i % 3 === 0
                        ? 'bg-c-goal-b'
                        : 'bg-c-goal-c'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  let features = [
    {
      name: 'Daily Momentum Tracker',
      description:
        'Visualize your consistency with our intuitive heatmap that shows your daily progress and streaks.',
      icon: '📈',
      color: 'text-c-goal-a',
    },
    {
      name: 'Habit Groups',
      description: 'Build momentum together by joining groups and tracking habits with friends.',
      icon: '👥',
      color: 'text-c-secondary',
    },
    // {
    //   name: 'Smart Reminders',
    //   description: 'Personalized notifications to keep your momentum going when you need it most.',
    //   icon: '⏰',
    //   color: 'text-c-accent',
    // },
    // {
    //   name: 'Progress Insights',
    //   description: 'See your long-term patterns and celebrate your momentum milestones.',
    //   icon: '🔍',
    //   color: 'text-c-primary',
    // },
    // {
    //   name: 'Flexible Tracking',
    //   description: 'Track any habit your way - yes/no, quantities, or time-based goals.',
    //   icon: '✅',
    //   color: 'text-c-goal-b',
    // },
    {
      name: 'Motivation Boost',
      description: 'Get encouragement when your momentum slows to help you get back on track.',
      icon: '💪',
      color: 'text-c-goal-c',
    },
  ]

  return (
    <section className='py-12 bg-c-surface' id='features'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='lg:text-center'>
          <h2 className='text-base text-c-primary font-semibold tracking-wide uppercase'>
            Your Momentum Engine
          </h2>
          <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-c-text sm:text-4xl'>
            Features designed for consistency
          </p>
          <p className='mt-4 max-w-2xl text-xl text-c-text-muted lg:mx-auto'>
            Pravah turns small daily actions into unstoppable momentum
          </p>
        </div>

        <div className='mt-10'>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {features.map((feature) => (
              <div
                key={feature.name}
                className='card bg-c-surface-muted p-6 hover:shadow-lg transition-shadow hover:-translate-y-1'
              >
                <div className='flex items-start'>
                  <span className={`text-3xl mr-4 ${feature.color}`}>{feature.icon}</span>
                  <div>
                    <h3 className='text-lg font-medium text-c-text'>{feature.name}</h3>
                    <p className='mt-1 text-sm text-c-text-muted'>{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className='bg-gradient-to-r from-c-primary to-c-accent'>
      <div className='max-w-7xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-extrabold text-white sm:text-4xl'>
          <span className='block'>Ready to turn small steps into big results?</span>
        </h2>
        <p className='mt-4 text-lg leading-6 text-c-surface'>
          Start your habit journey today with Pravah
        </p>
        <div className='mt-6 flex justify-center gap-3'>
          <Link
            to='/auth/signup'
            className='btn btn-secondary px-8 py-3 text-base font-medium text-c-text bg-white hover:bg-opacity-90 sm:px-10 border-none'
          >
            Launch Your Habits 🚀
          </Link>
        </div>
      </div>
    </section>
  )
}
