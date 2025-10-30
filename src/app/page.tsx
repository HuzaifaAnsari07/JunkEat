
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UtensilsCrossed, LogIn, MapPin } from 'lucide-react';
import { FloatingIcons } from '@/components/FloatingIcons';
import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc, getFirestore } from 'firebase/firestore';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationEnabled) {
      alert('Please enable your location to continue.');
      return;
    }
    
    // For now we will use anonymous sign in
    initiateAnonymousSignIn(auth);
  };
  
  // When user is created, we can create a user profile document
  useEffect(() => {
    if (user && name && email) {
      const firestore = getFirestore();
      const userRef = doc(firestore, 'users', user.uid);
      const userData = {
        name: name,
        email: email,
        phone: contactNumber,
        address: 'Default Address' // Placeholder
      };
      // We are not awaiting this, it will run in the background
      setDocumentNonBlocking(userRef, userData, { merge: true });
    }
  }, [user, name, email, contactNumber]);

  const handleEnableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location enabled:', position.coords.latitude, position.coords.longitude);
          setLocationEnabled(true);
        },
        (error) => {
          console.error('Error enabling location:', error.message);
          alert('Could not enable location. Please check your browser settings and grant permission.');
          setLocationEnabled(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  if (isUserLoading || user) {
    return (
        <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-orange-400 via-red-500 to-yellow-400 overflow-hidden">
      <FloatingIcons />
      <div className="container mx-auto flex items-center justify-center min-h-screen px-4 py-12">
        <Card className="w-full max-w-md shadow-2xl z-10 bg-background/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <UtensilsCrossed className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Welcome to JunkEats!</CardTitle>
            <CardDescription>Sign up to get your junk food fix.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  type="tel"
                  placeholder="123-456-7890"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              {isClient && (
                  <Button
                    type="button"
                    variant={locationEnabled ? "secondary" : "outline"}
                    className="w-full"
                    onClick={handleEnableLocation}
                    disabled={locationEnabled}
                  >
                    <MapPin className="mr-2 h-5 w-5"/>
                    {locationEnabled ? 'Location Enabled' : 'Enable Live Location'}
                  </Button>
              )}
              
              <Button type="submit" className="w-full font-bold" disabled={!isClient || !locationEnabled}>
                  <LogIn className="mr-2 h-5 w-5"/>
                  Continue
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm">
            <p className="w-full">
              By continuing, you agree to our terms of service.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
