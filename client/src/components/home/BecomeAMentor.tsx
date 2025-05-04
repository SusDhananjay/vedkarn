import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function BecomeAMentor() {
  return (
    <section className="py-12 bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Become a mentor
            </h2>
            <p className="mt-3 text-lg text-primary-100 sm:mt-4">
              Share your knowledge, help aspiring students, and earn extra income by becoming a mentor on our platform.
            </p>
            <div className="mt-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <p className="ml-3 text-base text-primary-100">
                    Help students achieve their dreams by sharing your experience and insights
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <p className="ml-3 text-base text-primary-100">
                    Earn ₹1500 per session while making a positive impact on students' lives
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <p className="ml-3 text-base text-primary-100">
                    Flexible scheduling - you decide when you're available to mentor
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <p className="ml-3 text-base text-primary-100">
                    All tools provided - video calls, messaging, and payment processing
                  </p>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/become-a-mentor">
                  <Button variant="secondary" className="inline-flex items-center px-5 py-3 text-base font-medium">
                    Apply to become a mentor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <img 
              className="rounded-lg shadow-lg" 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
              alt="Mentor teaching online" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
