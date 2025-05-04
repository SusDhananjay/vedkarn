import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Slot } from "@shared/schema";

interface BookingCalendarProps {
  mentorId: number;
  onSlotSelect: (slot: Slot) => void;
  selectedSlot?: Slot | null;
}

export default function BookingCalendar({ mentorId, onSlotSelect, selectedSlot }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selectedSlot ? new Date(selectedSlot.startTime) : undefined
  );

  const { data: slots, isLoading } = useQuery<Slot[]>({
    queryKey: [`/api/mentors/${mentorId}/slots`],
    enabled: !!mentorId,
  });

  // Group slots by date
  const slotsByDate: Record<string, Slot[]> = {};
  slots?.forEach((slot) => {
    const date = new Date(slot.startTime).toDateString();
    if (!slotsByDate[date]) {
      slotsByDate[date] = [];
    }
    slotsByDate[date].push(slot);
  });

  // Get available dates for calendar highlighting
  const availableDates = slots ? Array.from(new Set(slots.map(slot => 
    new Date(slot.startTime).toDateString()
  ))).map(dateStr => new Date(dateStr)) : [];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Filter slots for the selected date
  const slotsForSelectedDate = selectedDate
    ? slotsByDate[selectedDate.toDateString()] || []
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <h3 className="text-lg font-medium mb-2">Select Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              // Disable dates in the past and dates with no available slots
              const isInPast = date < new Date(new Date().setHours(0, 0, 0, 0));
              const dateString = date.toDateString();
              const hasSlots = Object.keys(slotsByDate).includes(dateString);
              return isInPast || !hasSlots;
            }}
            modifiers={{
              available: availableDates,
            }}
            modifiersClassNames={{
              available: "bg-primary-100 text-primary-900 font-medium",
            }}
            className="border rounded-md p-3"
          />
        </div>
        <div className="md:w-1/2">
          <h3 className="text-lg font-medium mb-2">Available Time Slots</h3>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : !selectedDate ? (
            <div className="bg-gray-50 rounded-md p-6 h-full flex items-center justify-center">
              <p className="text-gray-500 text-center">Please select a date to see available time slots</p>
            </div>
          ) : slotsForSelectedDate.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md h-full">
              {slotsForSelectedDate.map((slot) => (
                <Button
                  key={slot.id}
                  variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                  className="text-sm"
                  onClick={() => onSlotSelect(slot)}
                >
                  {new Date(slot.startTime).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </Button>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-md p-6 h-full flex items-center justify-center">
              <p className="text-gray-500 text-center">No time slots available for the selected date</p>
            </div>
          )}
        </div>
      </div>
      
      {selectedSlot && (
        <div className="bg-primary-50 p-4 rounded-md">
          <h3 className="font-medium text-primary-900">Selected Session</h3>
          <p className="text-primary-700 mt-1">
            {new Date(selectedSlot.startTime).toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric',
            })}, {' '}
            {new Date(selectedSlot.startTime).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })} - {new Date(selectedSlot.endTime).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </p>
        </div>
      )}
    </div>
  );
}
