import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MENTORSHIP_FEE } from "@/lib/constants";

const paymentSchema = z.object({
  cardNumber: z.string()
    .min(16, "Card number must be 16 digits")
    .max(16, "Card number must be 16 digits")
    .regex(/^\d+$/, "Card number must contain only digits"),
  expiryMonth: z.string()
    .min(1, "Expiry month is required")
    .max(2, "Invalid expiry month")
    .regex(/^(0?[1-9]|1[0-2])$/, "Expiry month must be between 1-12"),
  expiryYear: z.string()
    .min(2, "Expiry year is required")
    .max(2, "Use last 2 digits of year")
    .regex(/^\d+$/, "Expiry year must contain only digits"),
  cvv: z.string()
    .min(3, "CVV must be 3 digits")
    .max(3, "CVV must be 3 digits")
    .regex(/^\d+$/, "CVV must contain only digits"),
  nameOnCard: z.string().min(1, "Name on card is required"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  mentorId: number;
  slotId: number;
  onSuccess: (bookingId: number) => void;
}

export default function PaymentForm({ mentorId, slotId, onSuccess }: PaymentFormProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      nameOnCard: "",
    },
  });

  const processPaymentMutation = useMutation({
    mutationFn: async (data: PaymentFormValues) => {
      const response = await apiRequest("POST", "/api/bookings", {
        mentorId,
        slotId,
        paymentDetails: data,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Payment successful",
        description: "Your session has been booked successfully!",
      });
      onSuccess(data.bookingId);
    },
    onError: (error: any) => {
      toast({
        title: "Payment failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    },
  });

  const onSubmit = (data: PaymentFormValues) => {
    setIsProcessing(true);
    processPaymentMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex justify-between">
          <span className="font-medium">Mentorship Session Fee</span>
          <span>₹{MENTORSHIP_FEE.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t">
          <span className="font-bold">Total</span>
          <span className="font-bold">₹{MENTORSHIP_FEE.toLocaleString()}</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Payment Details</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nameOnCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on Card</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="1234 5678 9012 3456" 
                      maxLength={16}
                      {...field} 
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="expiryMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="MM" 
                        maxLength={2}
                        {...field} 
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiryYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="YY" 
                        maxLength={2}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123" 
                        maxLength={3}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay ₹${MENTORSHIP_FEE.toLocaleString()}`}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
