import About from "@/components/about";
import Booking from "@/components/booking";
import Hero from "@/components/hero";
import Location from "@/components/location";

export default function Home () {
  return (
    <>
    <main>
     <Hero />
      <About />
      <Location />
      <Booking /> 
    </main>
    </>
  );
}