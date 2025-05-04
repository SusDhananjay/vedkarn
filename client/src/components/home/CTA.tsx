import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Ready to find your mentor?</span>
          <span className="block text-primary">Start your journey today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link href="/find-mentors">
              <Button size="lg" className="px-5 py-3 text-base font-medium">
                Find a Mentor
              </Button>
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link href="/#how-it-works">
              <Button variant="outline" size="lg" className="px-5 py-3 text-base font-medium">
                Learn more
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
