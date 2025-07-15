import Link from "next/link";
import WaitlistForm from "../components/WaitlistForm"; // 👈 Client Component import

export default function LandingPage() {
  return (
    <main className='min-h-screen bg-[#17424D] text-white'>
      {/* Navbar */}
      <header className='flex justify-between items-center px-6 py-4 max-w-7xl mx-auto'>
        <h1 className='text-xl font-bold'>FraiJob</h1>
        <nav className='space-x-6 hidden md:flex text-sm'>
          <Link href='#'>How It Works</Link>
          <Link href='#'>Features</Link>
          <Link href='#'>Projects</Link>
          <Link href='#'>Community</Link>
          <Link href='#'>Jobs</Link>
          <Link href='#'>Pricing</Link>
          <Link href='#'>Testimonials</Link>
        </nav>
        <Link
          href='/signup'
          className='bg-white text-[#17424D] px-4 py-2 rounded-full text-sm font-semibold'>
          Get started
        </Link>
      </header>

      {/* Hero */}
      <section className='text-center py-20 px-4 max-w-3xl mx-auto'>
        <h2 className='text-4xl md:text-5xl font-bold mb-6 leading-tight'>
          Your AI Partner — FraiJob: <br />
          Become a Job-Ready Talent
        </h2>
        <p className='text-lg mb-8 text-gray-200'>
          Practice, prove, and unlock your next opportunity with FraiJob
        </p>
        <div className='flex flex-col sm:flex-row justify-center gap-4'>
          <Link
            href='#'
            className='bg-white text-[#17424D] px-6 py-3 rounded-full font-semibold text-sm'>
            Join FraiJob Waitlist
          </Link>
          <Link
            href='#'
            className='border border-white px-6 py-3 rounded-full font-semibold text-sm'>
            Start your journey
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-white text-[#17424D] py-16 px-6'>
        <div className='max-w-3xl mx-auto bg-[#F3F7FA] rounded-2xl p-6 md:p-10 text-center shadow-lg'>
          <h3 className='text-2xl md:text-3xl font-bold leading-snug mb-6'>
            Be the first to try FraiJob’s smart career tools.
          </h3>
          <WaitlistForm /> {/* 👈 Client component */}
          <p className='mt-6 text-sm md:text-base text-gray-600 leading-relaxed'>
            Spots are filling up fast — be among the first to shape FraiJob and
            unlock exclusive early-access benefits. Once we’re live, this early
            opportunity closes forever.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='bg-[#F3F7FA] text-[#17424D] py-16 px-6'>
        <div className='max-w-6xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-10'>
            See how FraiJob helps you build real skills and get hired - in 3 simple steps.
          </h2>

          <div className='grid md:grid-cols-3 gap-8 text-left'>
            {/* Step 1 */}
            <div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition'>
              <div className='w-12 h-12 rounded-full bg-[#17424D] text-white flex items-center justify-center text-xl font-bold mb-4'>
                1
              </div>
              <h3 className='text-xl font-semibold mb-2'>
                Create Your Smart Profile
              </h3>
              <p className='text-gray-700 text-sm'>
                Build your AI-powered resume. Get personalized skill assessments and a roadmap for your growth.
              </p>
            </div>

            {/* Step 2 */}
            <div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition'>
              <div className='w-12 h-12 rounded-full bg-[#17424D] text-white flex items-center justify-center text-xl font-bold mb-4'>
                2
              </div>
              <h3 className='text-xl font-semibold mb-2'>
                Practice & Prove Your Skills
              </h3>
              <p className='text-gray-700 text-sm'>
                Join real projects, collaborate with teams, and use the AI Interview Simulator to get job-ready faster.
              </p>
            </div>

            {/* Step 3 */}
            <div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition'>
              <div className='w-12 h-12 rounded-full bg-[#17424D] text-white flex items-center justify-center text-xl font-bold mb-4'>
                3
              </div>
              <h3 className='text-xl font-semibold mb-2'>
                Apply & Get Hired Instantly
              </h3>
              <p className='text-gray-700 text-sm'>
                One-click apply for freelance or full-time roles. Stand out with verified skills, real experience, and AI-ranked profile.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
