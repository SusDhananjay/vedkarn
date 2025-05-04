import { Video, Calendar, CreditCard, MessageSquare } from "lucide-react";

export default function Features() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Platform Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to connect with mentors
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform provides all the tools for a seamless mentorship experience
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <Video className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Integrated Video Calls</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Connect with mentors through our built-in video platform. No need to download additional software or share personal contact details.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <Calendar className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Smart Scheduling</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Book sessions based on your mentor's real-time availability. Get calendar invites and automated reminders before your session.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <CreditCard className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure Payments</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Pay securely through our integrated payment system. All sessions are fixed at ₹1500 to keep things simple and transparent.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">In-Platform Messaging</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Communicate with your mentor before and after sessions through our messaging system. Share documents and resources directly on the platform.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
