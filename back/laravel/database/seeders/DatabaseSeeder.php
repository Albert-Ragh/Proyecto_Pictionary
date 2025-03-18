<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Word;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //Categories
        {
            $category = new Category;
            $category -> name = "GENERAL";
            $category -> privacy = "public";
            $category -> save();
    
            $category = new Category;
            $category -> name = "PLACES";
            $category -> privacy = "public";
            $category -> save();
    
            $category = new Category;
            $category -> name = "ART";
            $category -> privacy = "public";
            $category -> save();
    
            $category = new Category;
            $category -> name = "SCIENCE";
            $category -> privacy = "public";
            $category -> save();
    
            $category = new Category;
            $category -> name = "SPORTS";
            $category -> privacy = "public";
            $category -> save();
    
            $category = new Category;
            $category -> name = "GEOGRAPHY";
            $category -> privacy = "public";
            $category -> save();
    
            $category = new Category;
            $category -> name = "COMPUTER SCIENCE";
            $category -> privacy = "public";
            $category -> save();
        }

        //General Knowledge
        {
            $word = new Word;
            $word -> name = "DOG";
            $word -> description = "A common household pet and loyal companion to humans";
            $word -> category_id = 1;
            $word -> save();

            $word = new Word;
            $word -> name = "RAIN";
            $word -> description = "Water falling from the sky in droplets";
            $word -> category_id = 1;
            $word -> save();

            $word = new Word;
            $word -> name = "TREE";
            $word -> description = "A perennial plant with a single stem or trunk";
            $word -> category_id = 1;
            $word -> save();

            $word = new Word;
            $word -> name = "SUN";
            $word -> description = "The star at the center of the solar system";
            $word -> category_id = 1;
            $word -> save();
            
            $word = new Word;
            $word -> name = "MATHEMATICS";
            $word -> description = "The study of numbers";
            $word -> category_id = 1;
            $word -> save();

            $word = new Word;
            $word -> name = "CAR";
            $word -> description = "A vehicle with four wheels, designed for transportation on roads";
            $word -> category_id = 1;
            $word -> save();

            $word = new Word;
            $word -> name = "BOOK";
            $word -> description = "A written or printed work consisting of pages bound together";
            $word -> category_id = 1;
            $word -> save();

            $word = new Word;
            $word -> name = "BIRD";
            $word -> description = "A warm-blooded, egg-laying vertebrate with feathers and wings";
            $word -> category_id = 1;
            $word -> save();

            $word = new Word;
            $word -> name = "CLOCK";
            $word -> description = "A device that tells time by means of a dial or digital display";
            $word -> category_id = 1;
            $word -> save();

            $word = new Word;
            $word -> name = "HOUSE";
            $word -> description = "A building designed for people to live in";
            $word -> category_id = 1;
            $word -> save();
        }

        //Places
        {
            $word = new Word;
            $word -> name = "MUSEUM";
            $word -> description = "A building or institution that exhibits objects of historical, cultural, or scientific significance";
            $word -> category_id = 2;
            $word -> save();

            $word = new Word;
            $word -> name = "PARK";
            $word -> description = "A public area designed for recreation and leisure   ";
            $word -> category_id = 2;
            $word -> save();

            $word = new Word;
            $word -> name = "FOREST";
            $word -> description = "A large area covered with trees and undergrowth";
            $word -> category_id = 2;
            $word -> save();

            $word = new Word;
            $word -> name = "AIRPORT";
            $word -> description = "A place where airplanes take off and land";
            $word -> category_id = 2;
            $word -> save();
            
            $word = new Word;
            $word -> name = "OFFICE";
            $word -> description = "A place where people work";
            $word -> category_id = 2;
            $word -> save();

            $word = new Word;
            $word -> name = "CITY";
            $word -> description = "A large urban area with a high population density";
            $word -> category_id = 2;
            $word -> save();

            $word = new Word;
            $word -> name = "HOSPITAL";
            $word -> description = "A place where people go for medical treatment";
            $word -> category_id = 2;
            $word -> save();

            $word = new Word;
            $word -> name = "CHURCH";
            $word -> description = "A place of worship for Christians";
            $word -> category_id = 2;
            $word -> save();

            $word = new Word;
            $word -> name = "TEMPLE";
            $word -> description = "A place of worship";
            $word -> category_id = 2;
            $word -> save();

            $word = new Word;
            $word -> name = "SCHOOL";
            $word -> description = "A place where children go to learn";
            $word -> category_id = 2;
            $word -> save();
        }

        //Art
        {
            $word = new Word;
            $word -> name = "COLOR";
            $word -> description = "Property of an object, result of the way it reflects or emits light";
            $word -> category_id = 3;
            $word -> save();

            $word = new Word;
            $word -> name = "BRUSH";
            $word -> description = "A tool used to apply paint to a surface";
            $word -> category_id = 3;
            $word -> save();

            $word = new Word;
            $word -> name = "CANVAS";
            $word -> description = "A fabric used for painting";
            $word -> category_id = 3;
            $word -> save();

            $word = new Word;
            $word -> name = "PALETTE";
            $word -> description = "A flat board used by artists to mix and hold paint";
            $word -> category_id = 3;
            $word -> save();
            
            $word = new Word;
            $word -> name = "SKETCH";
            $word -> description = "A quick drawing or outline intended to capture the basic elements of a subject";
            $word -> category_id = 3;
            $word -> save();

            $word = new Word;
            $word -> name = "PORTRAIT";
            $word -> description = "A representation of a person, typically the face";
            $word -> category_id = 3;
            $word -> save();

            $word = new Word;
            $word -> name = "SCULPTURE";
            $word -> description = "A three-dimensional work of art created by shaping or combining materials";
            $word -> category_id = 3;
            $word -> save();

            $word = new Word;
            $word -> name = "DESIGN";
            $word -> description = "The process of creating a plan or layout for something";
            $word -> category_id = 3;
            $word -> save();

            $word = new Word;
            $word -> name = "POEM";
            $word -> description = "A piece of writing in which the words rhyme";
            $word -> category_id = 3;
            $word -> save();

            $word = new Word;
            $word -> name = "SONG";
            $word -> description = "Short poem or other set of words set to music or meant to be sung.";
            $word -> category_id = 3;
            $word -> save();
        }

        //Science
        {
            $word = new Word;
            $word -> name = "ATOM";
            $word -> description = "The basic unit of a chemical element";
            $word -> category_id = 4;
            $word -> save();

            $word = new Word;
            $word -> name = "GRAVITY";
            $word -> description = "The force that attracts two bodies toward each other";
            $word -> category_id = 4;
            $word -> save();

            $word = new Word;
            $word -> name = "MAGNET";
            $word -> description = "An object that produces a magnetic field";
            $word -> category_id = 4;
            $word -> save();

            $word = new Word;
            $word -> name = "FOSSIL";
            $word -> description = "The remains of a prehistoric organism preserved in rock";
            $word -> category_id = 4;
            $word -> save();
            
            $word = new Word;
            $word -> name = "SOLAR";
            $word -> description = "Related to the sun or utilizing its energy";
            $word -> category_id = 4;
            $word -> save();

            $word = new Word;
            $word -> name = "MOLECULE";
            $word -> description = "A group of atoms bonded together";
            $word -> category_id = 4;
            $word -> save();

            $word = new Word;
            $word -> name = "ECOSYSTEM";
            $word -> description = "A community of living and nonliving things interacting in a specific area";
            $word -> category_id = 4;
            $word -> save();

            $word = new Word;
            $word -> name = "LASER";
            $word -> description = "A device that emits a narrow, intense beam of light";
            $word -> category_id = 4;
            $word -> save();

            $word = new Word;
            $word -> name = "ELECTRICITY";
            $word -> description = "A form of energy resulting from the flow of electrons";
            $word -> category_id = 4;
            $word -> save();

            $word = new Word;
            $word -> name = "SOUND";
            $word -> description = "A type of energy that travels through the air in the form of waves";
            $word -> category_id = 4;
            $word -> save();
        }

        //Sports
        {
            $word = new Word;
            $word -> name = "BASKETBALL";
            $word -> description = "A 5vs5 game in which each team tries to score points by throwing a ball through a hoop/basket";
            $word -> category_id = 5;
            $word -> save();

            $word = new Word;
            $word -> name = "FOOTBALL";
            $word -> description = "A 11vs11 game in which the objective is to score points by carrying or kicking the ball into the opposing team's net";
            $word -> category_id = 5;
            $word -> save();

            $word = new Word;
            $word -> name = "TENNIS";
            $word -> description = "A racket sport played between two players or pairs of players";
            $word -> category_id = 5;
            $word -> save();

            $word = new Word;
            $word -> name = "CRICKET";
            $word -> description = "The objective is to score runs by hitting the ball and running around the field while the other team tries to get them out";
            $word -> category_id = 5;
            $word -> save();
            
            $word = new Word;
            $word -> name = "SWIMMING";
            $word -> description = "A sport in which individuals or teams compete by swimming various distances using different strokes, typically in a pool or open water";
            $word -> category_id = 5;
            $word -> save();

            $word = new Word;
            $word -> name = "GOLF";
            $word -> description = "Players use clubs to hit a small ball into a series of holes in as few strokes as possible";
            $word -> category_id = 5;
            $word -> save();

            $word = new Word;
            $word -> name = "HOCKEY";
            $word -> description = "A 11vs11 game in which players use sticks to hit a ball into the opposing team's goal";
            $word -> category_id = 5;
            $word -> save();

            $word = new Word;
            $word -> name = "VOLLEYBALL";
            $word -> description = "A 6vs6 game in which a ball is hit back and forth over a net with the objective of making the ball land on the opposing team's court";
            $word -> category_id = 5;
            $word -> save();

            $word = new Word;
            $word -> name = "BASEBALL";
            $word -> description = "A 9vs9 bat game in which players try to hit a ball thrown by the opposing team's pitcher and then run around four bases";
            $word -> category_id = 5;
            $word -> save();

            $word = new Word;
            $word -> name = "BOXING";
            $word -> description = "A combat sport in which two people, usually wearing gloves, fight each other";
            $word -> category_id = 5;
            $word -> save();
        }

        //Geography
        {
            $word = new Word;
            $word -> name = "CONTINENT";
            $word -> description = "One of the seven large land masses on Earth";
            $word -> category_id = 6;
            $word -> save();

            $word = new Word;
            $word -> name = "RIVER";
            $word -> description = "A natural flowing watercourse, often emptying into an ocean";
            $word -> category_id = 6;
            $word -> save();

            $word = new Word;
            $word -> name = "MOUNTAIN";
            $word -> description = "A large natural elevation of the earth's surface";
            $word -> category_id = 6;
            $word -> save();

            $word = new Word;
            $word -> name = "ISLAND";
            $word -> description = "A piece of land surrounded by water";
            $word -> category_id = 6;
            $word -> save();
            
            $word = new Word;
            $word -> name = "DESERT";
            $word -> description = "A barren area of land where little precipitation occurs";
            $word -> category_id = 6;
            $word -> save();

            $word = new Word;
            $word -> name = "OCEAN";
            $word -> description = "A vast body of saltwater that covers almost 71 percent of the earth's surface";
            $word -> category_id = 6;
            $word -> save();

            $word = new Word;
            $word -> name = "VOLCANO";
            $word -> description = "A mountain that opens downward to a pool of molten rock";
            $word -> category_id = 6;
            $word -> save();

            $word = new Word;
            $word -> name = "PENINSULA";
            $word -> description = "A piece of land almost surrounded by water";
            $word -> category_id = 6;
            $word -> save();

            $word = new Word;
            $word -> name = "TUNDRA";
            $word -> description = "A vast, flat, treeless Arctic region of Europe, Asia, and North America";
            $word -> category_id = 6;
            $word -> save();

            $word = new Word;
            $word -> name = "COAST";
            $word -> description = "The land near the sea or ocean";
            $word -> category_id = 6;
            $word -> save();
        }

        //Computer Science
        {
            $word = new Word;
            $word -> name = "monitor";
            $word -> description = "Display device used to visually the output of a computer";
            $word -> category_id = 7;
            $word -> save();

            $word = new Word;
            $word -> name = "keyboard";
            $word -> description = "Input device that allows the user to input characters into the computer by pressing keys";
            $word -> category_id = 7;
            $word -> save();

            $word = new Word;
            $word -> name = "MOUSE";
            $word -> description = "A pointing device that allows the user to control the movement of the cursor on the computer screen";
            $word -> category_id = 7;
            $word -> save();

            $word = new Word;
            $word -> name = "PRINTER";
            $word -> description = "Device that produces a physical copy of electronic documents or images";
            $word -> category_id = 7;
            $word -> save();
            
            $word = new Word;
            $word -> name = "SCANNER";
            $word -> description = "Input device that captures images, documents, or other physical objects and converts them into digital images";
            $word -> category_id = 7;
            $word -> save();

            $word = new Word;
            $word -> name = "WEBCAM";
            $word -> description = "A camera that captures video and audio and sends it over the internet in real-time";
            $word -> category_id = 7;
            $word -> save();

            $word = new Word;
            $word -> name = "HEADSET";
            $word -> description = "A combination of headphones and microphone";
            $word -> category_id = 7;
            $word -> save();

            $word = new Word;
            $word -> name = "SPEAKER";
            $word -> description = "A device that produces audio output from a computer";
            $word -> category_id = 7;
            $word -> save();

            $word = new Word;
            $word -> name = "USB";
            $word -> description = "A portable storage device that provides additional storage capacity and to transfer data";
            $word -> category_id = 7;
            $word -> save();

            $word = new Word;
            $word -> name = "JOYSTICK";
            $word -> description = "Input gaming device that allows the user to control the movement";
            $word -> category_id = 7;
            $word -> save();
        }
    }
}
