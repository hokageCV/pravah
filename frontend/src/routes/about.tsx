import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutSection,
})

function AboutSection() {
  return (
    <section className='py-12 '>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='lg:text-center'>
          <h2 className='text-base text-c-primary font-semibold tracking-wide uppercase'>
            The Pravah Method
          </h2>
          <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-c-text sm:text-4xl'>
            ABC Goal Framework
          </p>
          <p className='mt-4 max-w-2xl text-xl text-c-text-muted lg:mx-auto'>
            Track each habit with three achievement levels for sustainable progress
          </p>
        </div>

        <div className='mt-10'>
          <div className='mt-10'>
            <div className='card bg-c-surface p-6 max-w-2xl mx-auto'>
              <div className='text-center mb-6'>
                <h3 className='text-lg font-medium text-c-text'>Example Goal: Daily Reading</h3>
                <p className='mt-1 text-sm text-c-text-muted'>
                  Tracked with ABC achievement levels
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='border border-c-goal-a rounded-lg p-4 text-center'>
                  <div className='mx-auto h-12 w-12 rounded-full bg-c-goal-a/10 flex items-center justify-center mb-2'>
                    <span className='text-xl font-bold text-c-goal-a'>A</span>
                  </div>
                  <h4 className='font-medium text-c-text'>Ambitious Target</h4>
                  <p className='mt-1 text-sm text-c-text-muted'>30 minutes</p>
                  <div className='mt-2 h-2 w-full bg-c-surface-muted rounded-full'>
                    <div className='h-2 rounded-full bg-c-goal-a' style={{ width: '100%' }}></div>
                  </div>
                </div>
                {/* B Target */}
                <div className='border border-c-goal-b rounded-lg p-4 text-center'>
                  <div className='mx-auto h-12 w-12 rounded-full bg-c-goal-b/10 flex items-center justify-center mb-2'>
                    <span className='text-xl font-bold text-c-goal-b'>B</span>
                  </div>
                  <h4 className='font-medium text-c-text'>Baseline Target</h4>
                  <p className='mt-1 text-sm text-c-text-muted'>15 minutes</p>
                  <div className='mt-2 h-2 w-full bg-c-surface-muted rounded-full'>
                    <div className='h-2 rounded-full bg-c-goal-b' style={{ width: '80%' }}></div>
                  </div>
                </div>
                {/* C Target */}
                <div className='border border-c-goal-c rounded-lg p-4 text-center'>
                  <div className='mx-auto h-12 w-12 rounded-full bg-c-goal-c/10 flex items-center justify-center mb-2'>
                    <span className='text-xl font-bold text-c-goal-c'>C</span>
                  </div>
                  <h4 className='font-medium text-c-text'>Minimum Target</h4>
                  <p className='mt-1 text-sm text-c-text-muted'>5 minutes</p>
                  <div className='mt-2 h-2 w-full bg-c-surface-muted rounded-full'>
                    <div className='h-2 rounded-full bg-c-goal-c' style={{ width: '60%' }}></div>
                  </div>
                </div>
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

          <div className='mt-12 text-center space-y-4 sm:space-y-0 sm:space-x-4'>
            <a
              href='https://www.sahilbloom.com/newsletter/the-abc-goal-system'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-c-accent hover:bg-c-accent-hover'
            >
              <svg
                className='mr-2 h-4 w-4'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z' />
              </svg>
              Read Article
            </a>
            <a
              href='https://www.youtube.com/watch?v=JvYsD_bM-RM'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center px-4 py-2 border border-c-accent text-sm font-medium rounded-md text-c-accent bg-white hover:bg-c-surface-muted'
            >
              <svg className='mr-2 h-4 w-4 text-red-600' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' />
              </svg>
              Watch Video
            </a>
          </div>
        </div>

        <div className='mt-8 p-4 bg-c-surface rounded-lg border border-c-border'>
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
      </div>
    </section>
  )
}
