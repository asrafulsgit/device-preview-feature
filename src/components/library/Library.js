import { contactComponents } from "../modules/contact/Contacts";
import { heroComponents } from "../modules/hero/Heros";
import { navbarComponents } from "../modules/Nav/Navbars";
import { newsLetterComponents } from "../modules/newLetter/NewsLetters";
import { prichingComponents } from "../modules/priching/Prichings";
import { testimonialComponents } from "../modules/testimonial/Testimonials";


export const library = [
       ...navbarComponents,
       ...heroComponents,
       ...testimonialComponents,
       ...prichingComponents,
       ...contactComponents,
       ...newsLetterComponents
]