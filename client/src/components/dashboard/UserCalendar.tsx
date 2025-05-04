import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { format, isSameDay, addDays, isAfter, isBefore } from "date-fns";

// Type for calendar events
interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: "upcoming" | "completed" | "available";
  mentorName?: string;
  mentorId?: number;
  studentName?: string;
  studentId?: number;
  bookingId?: number;
  slotId?: number;
}

export default function UserCalendar() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendarDates, setCalendarDates] = useState<{
    upcomingSessions: Date[];
    availableSlots: Date[];
  }>({
    upcomingSessions: [],
    availableSlots: [],
  });

  // Fetch bookings for the user
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: [
      user?.userType === "mentor"
        ? `/api/mentors/${user?.id}/bookings`
        : `/api/students/${user?.id}/bookings`,
    ],
    enabled: !!user,
  });

  // Fetch available slots if user is a mentor
  const { data: availableSlots, isLoading: slotsLoading } = useQuery({
    queryKey: [user?.userType === "mentor" ? `/api/mentors/${user?.id}/slots` : null],
    enabled: !!user && user.userType === "mentor",
  });

  // Process bookings and slots into events
  useEffect(() => {
    const newEvents: CalendarEvent[] = [];
    const upcomingSessions: Date[] = [];
    const availableSlotDates: Date[] = [];

    // Process bookings
    if (bookings) {
      bookings.forEach((booking: any) => {
        const startDate = new Date(booking.startTime);
        const endDate = new Date(booking.endTime);
        
        // Create event for booking
        newEvents.push({
          id: booking.id,
          title: user?.userType === "mentor" 
            ? `Session with ${booking.student.name}` 
            : `Session with ${booking.mentor.name}`,
          date: startDate,
          startTime: format(startDate, "h:mm a"),
          endTime: format(endDate, "h:mm a"),
          type: isAfter(startDate, new Date()) ? "upcoming" : "completed",
          mentorName: booking.mentor.name,
          mentorId: booking.mentorId,
          studentName: booking.student.name,
          studentId: booking.studentId,
          bookingId: booking.id,
          slotId: booking.slotId,
        });

        // Add to upcomingSessions for highlighting in calendar
        if (isAfter(startDate, new Date())) {
          upcomingSessions.push(startDate);
        }
      });
    }

    // Process available slots for mentors
    if (user?.userType === "mentor" && availableSlots) {
      availableSlots.forEach((slot: any) => {
        const startDate = new Date(slot.startTime);
        const endDate = new Date(slot.endTime);
        
        // Create event for available slot
        newEvents.push({
          id: slot.id,
          title: "Available Slot",
          date: startDate,
          startTime: format(startDate, "h:mm a"),
          endTime: format(endDate, "h:mm a"),
          type: "available",
          slotId: slot.id,
        });

        // Add to availableSlots for highlighting in calendar
        availableSlotDates.push(startDate);
      });
    }

    setEvents(newEvents);
    setCalendarDates({
      upcomingSessions,
      availableSlots: availableSlotDates,
    });
  }, [bookings, availableSlots, user]);

  // Filter events for the selected date
  const eventsForSelectedDate = selectedDate
    ? events.filter((event) => isSameDay(event.date, selectedDate))
    : [];

  // Navigation between months
  const nextMonth = () => {
    setCurrentMonth((current) => addDays(current, 30));
  };

  const prevMonth = () => {
    setCurrentMonth((current) => addDays(current, -30));
  };

  // Get date class for highlighting in calendar
  const getDateClass = (date: Date) => {
    if (
      calendarDates.upcomingSessions.some((sessionDate) =>
        isSameDay(sessionDate, date)
      )
    ) {
      return "bg-primary/20 text-primary-foreground font-medium rounded-full";
    }
    if (
      user?.userType === "mentor" &&
      calendarDates.availableSlots.some((slotDate) =>
        isSameDay(slotDate, date)
      )
    ) {
      return "bg-green-100 text-green-800 font-medium rounded-full";
    }
    return "";
  };

  // Sort events by date and time
  const sortedEvents = [...eventsForSelectedDate].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Filter upcoming and past events
  const upcomingEvents = sortedEvents.filter(
    (event) => event.type === "upcoming" || event.type === "available"
  );
  
  const pastEvents = sortedEvents.filter(
    (event) => event.type === "completed"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse md:flex-row gap-6">
        {/* Calendar */}
        <Card className="md:w-1/2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Calendar</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevMonth}
                  title="Previous Month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {format(currentMonth, "MMMM yyyy")}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                  title="Next Month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="border rounded-md p-0"
              modifiers={{
                booked: calendarDates.upcomingSessions,
                available: calendarDates.availableSlots,
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: "var(--primary-50)",
                  color: "var(--primary-900)",
                  fontWeight: "700",
                },
                available: {
                  backgroundColor: "var(--green-50)",
                  color: "var(--green-900)",
                  fontWeight: "500",
                },
              }}
              components={{
                DayContent: ({ date, ...props }) => (
                  <div
                    {...props}
                    className={cn(
                      "h-8 w-8 flex items-center justify-center rounded-full",
                      getDateClass(date)
                    )}
                  >
                    {format(date, "d")}
                  </div>
                ),
              }}
            />
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded-full bg-primary/20"></div>
                <span>Booked Sessions</span>
              </div>
              {user?.userType === "mentor" && (
                <div className="flex items-center">
                  <div className="mr-1 h-3 w-3 rounded-full bg-green-100"></div>
                  <span>Available Slots</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Event details */}
        <Card className="md:w-1/2">
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? format(selectedDate, "EEEE, MMMM d, yyyy")
                : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={`${event.id}-${event.type}`}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={event.type === "available" ? "outline" : "default"}
                          className={
                            event.type === "available"
                              ? "bg-green-50 text-green-800 border-green-200"
                              : ""
                          }
                        >
                          {event.type === "available" ? "Available" : "Upcoming"}
                        </Badge>
                      </div>
                      <div className="flex mt-3 space-x-2">
                        {event.type === "upcoming" && (
                          <>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/messages?with=${event.type === "upcoming" && user?.userType === "student" ? event.mentorId : event.studentId}`}>
                                <MessageSquare className="h-4 w-4 mr-1" /> Message
                              </Link>
                            </Button>
                            <Button size="sm" asChild>
                              <Link href={`/session/${event.bookingId}`}>
                                <Video className="h-4 w-4 mr-1" /> Join Session
                              </Link>
                            </Button>
                          </>
                        )}
                        {event.type === "available" && user?.userType === "mentor" && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/manage-slots`}>
                              <CalendarIcon className="h-4 w-4 mr-1" /> Manage Slot
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <CalendarIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      No upcoming sessions for this date
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="space-y-4">
                {pastEvents.length > 0 ? (
                  pastEvents.map((event) => (
                    <div
                      key={`${event.id}-${event.type}`}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      <div className="flex mt-3 space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={user?.userType === "student" ? `/review/${event.bookingId}` : `/session-details/${event.bookingId}`}>
                            {user?.userType === "student" ? "Leave Review" : "View Details"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <CalendarIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No past sessions for this date</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming sessions notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents
                .filter(event => event.type === "upcoming")
                .map((event) => (
                  <div
                    key={`notification-${event.id}`}
                    className="flex items-center justify-between bg-primary-50 p-4 rounded-lg"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary text-white p-2 rounded-full">
                        <CalendarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-600">
                          {format(event.date, "EEE, MMM d")} • {event.startTime} - {event.endTime}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/session/${event.bookingId}`}>
                        Join
                      </Link>
                    </Button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No upcoming notifications</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}