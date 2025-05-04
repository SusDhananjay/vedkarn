import { Star } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary tracking-wide uppercase">Testimonials</h2>
          <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
            Hear from our successful students
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Students who connected with mentors on our platform have achieved their dream goals
          </p>
        </div>
        <div className="mt-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <img 
                    className="h-12 w-12 rounded-full" 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="Student profile picture" 
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Neha Gupta</h3>
                  <p className="text-sm text-gray-500">Admitted to IIT Delhi</p>
                  <div className="mt-1 flex">
                    <Star className="h-4 w-4 text-accent-500 fill-current" />
                    <Star className="h-4 w-4 text-accent-500 fill-current" />
                    <Star className="h-4 w-4 text-accent-500 fill-current" />
                    <Star className="h-4 w-4 text-accent-500 fill-current" />
                    <Star className="h-4 w-4 text-accent-500 fill-current" />
                  </div>
                  <p className="mt-3 text-gray-600">
                    "I was struggling with JEE preparation and didn't know how to approach it. My mentor from IIT Delhi guided me through the entire process, helped me create a study plan, and gave me insights that no coaching center could provide. I'm now studying at IIT Delhi and couldn't be happier!"
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <img 
                    className="h-12 w-12 rounded-full" 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="Student profile picture" 
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Arjun Reddy</h3>
                  <p className="text-sm text-gray-500">Software Engineer at Microsoft</p>
                  <div className="mt-1 flex">
                    <Star className="h-4 w-4 text-accent-500 fill-current" />
                    <Star className="h-4 w-4 text-accent-500 fill-current" />
                    <Star className="h-4 w-4 text-accent-500 fill-current" />
                    <Star className="h-4 w-4 text-accent-500 fill-current" />
                    <Star className="h-4 w-4 text-accent-500 fill-current" />
                  </div>
                  <p className="mt-3 text-gray-600">
                    "After multiple failed interviews at tech giants, I connected with a mentor who works at Microsoft. She gave me practical advice, conducted mock interviews, and identified weaknesses in my approach. Within 3 months, I secured a position at Microsoft. Best investment I've ever made!"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a href="#" className="text-primary hover:text-primary-700 font-medium">
              Read more success stories <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
