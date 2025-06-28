import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutSection,
})

function AboutSection() {
  return (
    <section className='py-12 bg-c-surface-muted'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16'>
        <ABCFrameworkSection />
        <GroupFeaturesSection />
        <PWAInstallNotice />
      </div>
    </section>
  )
}

function ABCFrameworkSection() {
  return (
    <div>
      <SectionHeader
        title='The Pravah Method'
        subtitle='ABC Goal Framework'
        description='Track each habit with three achievement levels for sustainable progress'
      />

      <div className='mt-10'>
        <div className='card bg-c-surface p-6 max-w-2xl mx-auto'>
          <div className='text-center mb-6'>
            <h3 className='text-lg font-medium text-c-text'>Example Goal: Daily Reading</h3>
            <p className='mt-1 text-sm text-c-text-muted'>Tracked with ABC achievement levels</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <GoalTarget
              level='A'
              title='Ambitious Target'
              value='30 minutes'
              progress={100}
              color='c-goal-a'
            />
            <GoalTarget
              level='B'
              title='Baseline Target'
              value='15 minutes'
              progress={80}
              color='c-goal-b'
            />
            <GoalTarget
              level='C'
              title='Minimum Target'
              value='5 minutes'
              progress={60}
              color='c-goal-c'
            />
          </div>

          <div className='mt-8 text-sm text-c-text-muted'>
            <p>
              The ABC system creates flexible achievement levels for each goal. Hitting your{' '}
              <span className='text-c-goal-a font-medium'>A target</span> is ideal, but{' '}
              <span className='text-c-goal-b font-medium'>B</span> maintains momentum, and even{' '}
              <span className='text-c-goal-c font-medium'>C</span> keeps the habit alive.
            </p>
          </div>
        </div>
      </div>

      <ResourceLinks />
    </div>
  )
}

function GroupFeaturesSection() {
  return (
    <div className='pt-5'>
      <SectionHeader
        title='Collaborative Tracking'
        subtitle='Build Habits Together'
        description='Join forces with friends and stay accountable through groups'
      />

      <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <FeatureCard
          icon='👥'
          title='Create Groups'
          description='Start a group and invite others to join your habit journey'
          color='c-secondary'
          points={['One person creates the group as owner', 'Add members via username']}
        />
        <FeatureCard
          icon='📊'
          title='Share Habits'
          description='Select which habits to track together'
          color='c-accent-subtle'
          points={[
            'Each member chooses habits to contribute',
            'Control your privacy - share only what you want',
          ]}
        />
        <FeatureCard
          icon='🚀'
          title='Track Together'
          description="See everyone's progress in one place"
          color='c-primary'
          points={[
            'Monthly progress heatmaps for all members',
            'Celebrate streaks and milestones together',
          ]}
        />
      </div>
    </div>
  )
}

function PWAInstallNotice() {
  return (
    <div className='p-4 bg-c-surface rounded-lg border border-c-border'>
      <div className='flex items-start'>
        <div className='flex-shrink-0 mt-1'>
          <svg
            className='h-5 w-5 text-c-accent'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4'
            />
          </svg>
        </div>
        <div className='ml-3 space-y-2'>
          <h4 className='font-medium text-c-text'>Install Pravah as App</h4>
          <div className='text-sm text-c-text-muted space-y-1.5'>
            <p>
              <span className='font-medium'>Desktop:</span> Look for the
              <span className='mx-1 inline-flex items-center justify-center h-5 w-5 bg-c-accent/10 text-c-accent rounded-full'>
                ↓
              </span>
              install button in your address bar
            </p>
            <p>
              <span className='font-medium'>Mobile:</span> Tap
              <span className='mx-1 font-mono bg-c-surface-muted px-1.5 py-0.5 rounded border border-c-border'>
                ⫶
              </span>
              → "Add to Home Screen"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({
  title,
  subtitle,
  description,
}: {
  title: string
  subtitle: string
  description: string
}) {
  return (
    <div className='lg:text-center'>
      <h2 className='text-base text-c-primary font-semibold tracking-wide uppercase'>{title}</h2>
      <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-c-text sm:text-4xl'>
        {subtitle}
      </p>
      <p className='mt-4 max-w-2xl text-xl text-c-text-muted lg:mx-auto'>{description}</p>
    </div>
  )
}

function GoalTarget({
  level,
  title,
  value,
  progress,
  color,
}: {
  level: string
  title: string
  value: string
  progress: number
  color: string
}) {
  return (
    <div className={`border border-${color} rounded-lg p-4 text-center`}>
      <div
        className={`mx-auto h-12 w-12 rounded-full bg-${color}/10 flex items-center justify-center mb-2`}
      >
        <span className={`text-xl font-bold text-${color}`}>{level}</span>
      </div>
      <h4 className='font-medium text-c-text'>{title}</h4>
      <p className='mt-1 text-sm text-c-text-muted'>{value}</p>
      <div className='mt-2 h-2 w-full bg-c-surface-muted rounded-full'>
        <div className={`h-2 rounded-full bg-${color}`} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  )
}

function ResourceLinks() {
  return (
    <div className='mt-12 text-center space-y-4 sm:space-y-0 sm:space-x-4'>
      <ResourceLink
        href='https://www.sahilbloom.com/newsletter/the-abc-goal-system'
        icon='article'
        text='Read Article'
      />
      <ResourceLink
        href='https://www.youtube.com/watch?v=JvYsD_bM-RM'
        icon='youtube'
        text='Watch Video'
      />
    </div>
  )
}

function ResourceLink({ href, icon, text }: { href: string; icon: string; text: string }) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
        icon === 'youtube'
          ? 'border-c-accent text-c-accent bg-white hover:bg-c-surface-muted'
          : 'border-transparent text-white bg-c-accent hover:bg-c-accent-hover'
      }`}
    >
      {icon === 'youtube' ? (
        <>
          <svg className='mr-2 h-4 w-4 text-red-600' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' />
          </svg>
          {text}
        </>
      ) : (
        <>
          <svg
            className='mr-2 h-4 w-4'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z' />
          </svg>
          {text}
        </>
      )}
    </a>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color,
  points,
}: {
  icon: string
  title: string
  description: string
  color: string
  points: string[]
}) {
  return (
    <div className='card bg-c-surface p-6 hover:shadow-lg transition-shadow'>
      <div className='flex items-center'>
        <div className={`flex-shrink-0 bg-${color}/10 rounded-md p-3`}>
          <span className='text-2xl font-bold'>{icon}</span>
        </div>
        <div className='ml-4'>
          <h3 className='text-lg font-medium text-c-text'>{title}</h3>
          <p className='mt-1 text-sm text-c-text-muted'>{description}</p>
        </div>
      </div>
      <ul className='mt-4 pl-2 space-y-2 text-sm text-c-text-muted'>
        {points.map((point, index) => (
          <li key={index} className='flex items-start'>
            <span className={`text-${color} mr-2`}>•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
