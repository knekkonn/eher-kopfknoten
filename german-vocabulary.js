/* Reviewed German everyday vocabulary. English keys are exact, never substrings.
 * Scopes prevent Apple (the company), Python (the language), song titles, etc.
 * from being translated as ordinary nouns. Source answer identities keep scores.
 */
(()=>{'use strict';
const sections=[];
function add(scope,text){sections.push({scope,rows:text.trim().split('\n').filter(Boolean).map(line=>line.split('|'))})}
add('common',`
Chocolate|Schokolade
Banana|Banane
Strawberry|Erdbeere
Strawberries|Erdbeeren
Vanilla|Vanille
Blueberry|Heidelbeere
Blueberries|Heidelbeeren
Raspberry|Himbeere
Blackberry|Brombeere
Cherry|Kirsche
Cherries|Kirschen
Apple|Apfel
Pear|Birne
Peach|Pfirsich
Apricot|Aprikose
Plum|Pflaume
Grape|Weintraube
Grapes|Weintrauben
Watermelon|Wassermelone
Pineapple|Ananas
Lemon|Zitrone
Lime|Limette
Blood orange|Blutorange
Grapefruit|Grapefruit
Black sesame|Schwarzer Sesam
Bubblegum|Kaugummi
Butter pecan|Butter-Pekannuss
Peanut butter|Erdnussbutter
Almond|Mandel
Almonds|Mandeln
Peanut|Erdnuss
Walnut|Walnuss
Hazelnut|Haselnuss
Chestnut|Kastanie
Pistachio|Pistazie
Coconut|Kokosnuss
Honey|Honig
Sugar|Zucker
Salt|Salz
Cinnamon|Zimt
Saffron|Safran
Turmeric|Kurkuma
Ginger|Ingwer
Garlic|Knoblauch
Basil|Basilikum
Thyme|Thymian
Rosemary|Rosmarin
Parsley|Petersilie
Chives|Schnittlauch
Clove|Gewürznelke
Cloves|Gewürznelken
Nutmeg|Muskatnuss
Cumin|Kreuzkümmel
Caraway|Kümmel
Bay leaf|Lorbeerblatt
Black pepper|Schwarzer Pfeffer
White pepper|Weißer Pfeffer
Star anise|Sternanis
Cardamom|Kardamom
Mint|Minze
Peppermint|Pfefferminze
Potato|Kartoffel
Potatoes|Kartoffeln
Carrot|Karotte
Carrots|Karotten
Onion|Zwiebel
Onions|Zwiebeln
Mushroom|Pilz
Mushrooms|Pilze
Tomato|Tomate
Tomatoes|Tomaten
Cucumber|Gurke
Broccoli|Brokkoli
Cauliflower|Blumenkohl
Spinach|Spinat
Kale|Grünkohl
Lettuce|Kopfsalat
Romaine|Römersalat
Cabbage|Kohl
Red cabbage|Rotkohl
Brussels sprouts|Rosenkohl
Celery|Sellerie
Eggplant|Aubergine
Pumpkin|Kürbis
Sweet potato|Süßkartoffel
Sweetcorn|Zuckermais
Corn|Mais
Oats|Hafer
Wheat|Weizen
Barley|Gerste
Rye|Roggen
Rice|Reis
Bean|Bohne
Black bean|Schwarze Bohne
Chickpea|Kichererbse
Lentil|Linse
Pea|Erbse
Cheese|Käse
Milk|Milch
Water|Wasser
Coffee|Kaffee
Tea|Tee
Beer|Bier
Wine|Wein
Red wine|Rotwein
White wine|Weißwein
Orange juice|Orangensaft
Apple juice|Apfelsaft
Almond milk|Mandelmilch
Oat milk|Hafermilch
Soy milk|Sojamilch
Chocolate milk|Schokoladenmilch
Skim milk|Magermilch
Whole milk|Vollmilch
Egg|Ei
Eggs|Eier
Bread|Brot
White bread|Weißbrot
Banana bread|Bananenbrot
Breadsticks|Grissini
French fries|Pommes frites
Mashed potatoes|Kartoffelpüree
Fried rice|Gebratener Reis
Fried chicken|Frittiertes Hähnchen
Scrambled eggs|Rührei
Fried eggs|Spiegeleier
Boiled eggs|Gekochte Eier
Deviled eggs|Gefüllte Eier
Poached eggs|Pochierte Eier
Porridge|Haferbrei
Pancakes|Pfannkuchen
Applesauce|Apfelmus
Baby food|Babynahrung
Meatball|Fleischbällchen
Fish fingers|Fischstäbchen
Fish sticks|Fischstäbchen
Chicken noodle soup|Hühnernudelsuppe
Tomato soup|Tomatensuppe
Mushroom soup|Pilzsuppe
Vegetable soup|Gemüsesuppe
French onion soup|Französische Zwiebelsuppe
Ice cream|Eiscreme
Ice cream cone|Eiswaffel
Birthday cake|Geburtstagstorte
Chocolate cake|Schokoladenkuchen
Cheesecake|Käsekuchen
Apple pie|Apfelkuchen
Lollipop|Lutscher
Candy cane|Zuckerstange
Marshmallow|Marshmallow
Caramel|Karamell
Baking powder|Backpulver
Baking soda|Natron
Flour|Mehl
Butter|Butter
Olive oil|Olivenöl
Vinegar|Essig
Soy sauce|Sojasoße
BBQ sauce|Barbecuesoße
Gravy|Bratensoße
Mustard|Senf
Horse|Pferd
Cow|Kuh
Cattle|Rind
Pig|Schwein
Sheep|Schaf
Goat|Ziege
Chicken|Huhn
Duck|Ente
Goose|Gans
Dog|Hund
Domestic dog|Haushund
Cat|Katze
Domestic cat|Hauskatze
Mouse|Maus
Rat|Ratte
Rabbit|Kaninchen
Hare|Hase
Guinea pig|Meerschweinchen
Squirrel|Eichhörnchen
Chipmunk|Streifenhörnchen
Bat|Fledermaus|tier|vogel|säugetier
Fox|Fuchs
Bear|Bär
Polar bear|Eisbär
Deer|Hirsch
Reindeer|Rentier
Moose|Elch
Lion|Löwe
Elephant|Elefant
Hippopotamus|Flusspferd
Rhinoceros|Nashorn
Monkey|Affe
Chimpanzee|Schimpanse
Donkey|Esel
Camel|Kamel
Kangaroo|Känguru
Lizard|Eidechse
Snake|Schlange
Cobra|Kobra
Rattlesnake|Klapperschlange
Crocodile|Krokodil
Tortoise|Landschildkröte
Sea turtle|Meeresschildkröte
Frog|Frosch
Toad|Kröte
Newt|Molch
Beaver|Biber
Otter|Otter
Seal|Robbe|tier|säugetier|arktis|antarktis
Dolphin|Delfin
Whale|Wal
Blue whale|Blauwal
Killer whale|Schwertwal
Shark|Hai
Bull shark|Bullenhai
Great white shark|Weißer Hai
Hammerhead shark|Hammerhai
Blacktip shark|Schwarzspitzenhai
Blue shark|Blauhai
Lemon shark|Zitronenhai
Basking shark|Riesenhai
Angel shark|Engelhai
Cookie cutter shark|Zigarrenhai
Octopus|Krake
Squid|Kalmar
Jellyfish|Qualle
Snail|Schnecke
Crab|Krabbe
Lobster|Hummer
Shrimp|Garnele
Ant|Ameise
Bee|Biene
Beetle|Käfer
Butterfly|Schmetterling
Caterpillar|Raupe
Mosquito|Stechmücke
Flea|Floh
Tick|Zecke
Wasp|Wespe
Firefly|Glühwürmchen
Spider|Spinne
Eagle|Adler
Falcon|Falke
Hawk|Habicht
Owl|Eule
Crow|Krähe
Raven|Rabe
Sparrow|Spatz
Robin|Rotkehlchen
Canary|Kanarienvogel
Parrot|Papagei
Pigeon|Taube
Dove|Taube
Pelican|Pelikan
Penguin|Pinguin
Ostrich|Strauß
German Shepherd|Deutscher Schäferhund
Brain|Gehirn
Heart|Herz
Lung|Lunge
Lungs|Lungen
Liver|Leber
Kidney|Niere
Skin|Haut
Bladder|Harnblase
Stomach|Magen
Tongue|Zunge
Head|Kopf
Hair|Haar
Face|Gesicht
Forehead|Stirn
Cheek|Wange
Cheeks|Wangen
Chin|Kinn
Ear|Ohr
Ears|Ohren
Eye|Auge
Eyes|Augen
Nose|Nase
Mouth|Mund
Tooth|Zahn
Teeth|Zähne
Neck|Hals
Shoulder|Schulter
Arm|Arm
Arms|Arme
Elbow|Ellenbogen
Elbows|Ellenbogen
Hand|Hand
Hands|Hände
Finger|Finger
Fingers|Finger
Thumb|Daumen
Leg|Bein
Legs|Beine
Knee|Knie
Foot|Fuß
Feet|Füße
Toe|Zeh
Hip|Hüfte
Chest|Brust
Beard|Bart
Mustache|Schnurrbart
Skull|Schädel
Rib|Rippe
Ribs|Rippen
Spine|Wirbelsäule
Femur|Oberschenkelknochen
Fibula|Wadenbein
Blood|Blut
Saliva|Speichel
Sweat|Schweiß
Tears|Tränen
Urine|Urin
Feces|Kot
Mucus|Schleim
Adrenaline|Adrenalin
Antibodies|Antikörper
Brainstem|Hirnstamm
Brain stem|Hirnstamm
Cerebellum|Kleinhirn
Biceps|Bizeps
Eyeball|Augapfel
Cells|Zellen
Bones|Knochen
Back of the head|Hinterkopf
Frontal lobe|Frontallappen
Body aches|Gliederschmerzen
Chills|Schüttelfrost
Cough|Husten
Fever|Fieber
Headache|Kopfschmerzen
Sore throat|Halsschmerzen
Runny nose|Laufende Nase
Sneezing|Niesen
Chair|Stuhl
Table|Tisch
Bed|Bett
Sofa|Sofa
Couch|Sofa
Wardrobe|Kleiderschrank
Bookshelf|Bücherregal
Desk|Schreibtisch
Office chair|Bürostuhl
Armchair|Sessel
Recliner|Liegesessel
Bar stool|Barhocker
Coffee table|Couchtisch
Dining table|Esstisch
End table|Beistelltisch
Single bed|Einzelbett
Double bed|Doppelbett
Bunk bed|Etagenbett
Camp bed|Feldbett
Canopy bed|Himmelbett
Air mattress|Luftmatratze
Pillow|Kopfkissen
Blanket|Decke
Mattress|Matratze
House|Haus
Apartment|Wohnung
Condominium|Eigentumswohnung
Beach house|Strandhaus
Tent|Zelt
Cabin|Hütte
Castle|Burg
Church|Kirche
Mosque|Moschee
Synagogue|Synagoge
Temple|Tempel
Barn|Scheune
Burrow|Tierbau
Cave|Höhle
Nest|Nest
Kennel|Hundehütte
Basement|Keller
Attic|Dachboden
Bathroom|Badezimmer
Kitchen|Küche
Living room|Wohnzimmer
Bedroom|Schlafzimmer
Classroom|Klassenzimmer
Bathtub|Badewanne
Shower|Dusche
Sink|Waschbecken
Toilet|Toilette
Towel|Handtuch
Toilet paper|Toilettenpapier
Soap|Seife
Hand soap|Handseife
Hand sanitizer|Händedesinfektionsmittel
Toothbrush|Zahnbürste
Toothpaste|Zahnpasta
Hairbrush|Haarbürste
Comb|Kamm
Hair dryer|Haartrockner
Hair gel|Haargel
Hairspray|Haarspray
Conditioner|Haarspülung
Lip balm|Lippenbalsam
Sunscreen|Sonnencreme
Nail polish|Nagellack
Nail file|Nagelfeile
Nail clipper|Nagelknipser
Nail clippers|Nagelknipser
Cotton pad|Wattepad
Paintbrush|Pinsel
Dish brush|Spülbürste
Broom|Besen
Mop|Wischmopp
Vacuum cleaner|Staubsauger
Detergent|Reinigungsmittel
Rubber gloves|Gummihandschuhe
Hammer|Hammer
Shovel|Schaufel
Spade|Spaten
Hoe|Hacke
Rake|Rechen
Pickaxe|Spitzhacke
Screwdriver|Schraubendreher
Wrench|Schraubenschlüssel
Pliers|Zange
Saw|Säge
Drill|Bohrmaschine
Chainsaw|Kettensäge
Circular saw|Kreissäge
Tape measure|Maßband
Scissors|Schere
Tweezers|Pinzette
Tongs|Zange
Kitchen tongs|Küchenzange
Fork|Gabel
Knife|Messer
Spoon|Löffel
Ladle|Schöpfkelle
Chopsticks|Essstäbchen
Can opener|Dosenöffner
Bottle opener|Flaschenöffner
Corkscrew|Korkenzieher
Whisk|Schneebesen
Spatula|Pfannenwender
Rolling pin|Nudelholz
Cutting board|Schneidebrett
Baking sheet|Backblech
Cake pan|Kuchenform
Measuring cups|Messbecher
Oven|Backofen
Stove|Herd
Microwave|Mikrowelle
Dishwasher|Geschirrspüler
Refrigerator|Kühlschrank
Freezer|Gefrierschrank
Blender|Standmixer
Kettle|Wasserkocher
Coffee maker|Kaffeemaschine
Air fryer|Heißluftfritteuse
Fan|Ventilator
Ceiling fan|Deckenventilator
Air conditioner|Klimaanlage
Air purifier|Luftreiniger
Air pump|Luftpumpe
Balloon|Luftballon
Bottle|Flasche
Can|Dose
Cup|Tasse
Mug|Becher
Glass|Glas
Bowl|Schüssel
Plate|Teller
Paper|Papier
Paper clip|Büroklammer
Pen|Kugelschreiber
Pencil|Bleistift
Eraser|Radiergummi
Ruler|Lineal
Stapler|Hefter
Notebook|Notizbuch|büro|schreib|papier|seiten
Book|Buch
Calendar|Kalender
Magazine|Zeitschrift
Newspaper|Zeitung
Binder|Aktenordner
Envelope|Briefumschlag
Letter|Brief
Postcard|Postkarte
Birthday card|Geburtstagskarte
Business card|Visitenkarte
Christmas card|Weihnachtskarte
Library card|Bibliotheksausweis
Credit card|Kreditkarte
ID card|Personalausweis
Backpack|Rucksack
Wallet|Geldbörse
Purse|Handtasche
Pocket|Tasche
Hat|Hut
Cap|Kappe
Beanie|Strickmütze
Coat|Mantel
Jacket|Jacke
Dress|Kleid
Skirt|Rock
Shirt|Hemd
Sweater|Pullover
Trousers|Hose
Socks|Socken
Gloves|Handschuhe
Scarf|Schal
Boots|Stiefel
Running shoes|Laufschuhe
Sandals|Sandalen
Slippers|Hausschuhe
Dress shoes|Anzugschuhe
Bow tie|Fliege
Tie|Krawatte|kleid|formell|mode
Button|Knopf
Collar|Kragen
Sleeve|Ärmel
Zipper|Reißverschluss
Laces|Schnürsenkel
Insole|Einlegesohle
Heel|Ferse
Sole|Sohle
Cotton|Baumwolle
Silk|Seide
Wool|Wolle
Linen|Leinen
Leather|Leder
Steel|Stahl
Wood|Holz
Brick|Ziegel
Bricks|Ziegel
Concrete|Beton
Cement|Zement
Copper|Kupfer
Iron|Eisen
Oxygen|Sauerstoff
Hydrogen|Wasserstoff
Nitrogen|Stickstoff
Carbon|Kohlenstoff
Carbon dioxide|Kohlendioxid
Sulfur|Schwefel
Fluorine|Fluor
Chlorine|Chlor
Iodine|Iod
Sodium|Natrium
Potassium|Kalium
Mercury|Quecksilber|element|metall|stoff
Lead|Blei
Silver|Silber
Gold|Gold
Aluminum|Aluminium
Diamond|Diamant
Ruby|Rubin
Emerald|Smaragd
Marble|Marmor
Granite|Granit
Airplane|Flugzeug
Aeroplane|Flugzeug
Boat|Boot
Ship|Schiff
Helicopter|Hubschrauber
Airship|Luftschiff
Car|Auto
Bicycle|Fahrrad
Motorcycle|Motorrad
Train|Zug
Tram|Straßenbahn
Subway|U-Bahn
Ferry|Fähre
Canoe|Kanu
Sailboat|Segelboot
Electric bicycle|Elektrofahrrad
Shopping cart|Einkaufswagen
Roller skates|Rollschuhe
Elevator|Aufzug
Escalator|Rolltreppe
Engine|Motor
Steering wheel|Lenkrad
Wheel|Rad
Tire|Reifen
Wing|Flügel
Wings|Flügel
Ashtray|Aschenbecher
Traffic light|Ampel
Traffic cone|Leitkegel
One way|Einbahnstraße
Speed limit|Geschwindigkeitsbegrenzung
Dead end|Sackgasse
Stop sign|Stoppschild
Deer crossing|Wildwechsel
Bus lane|Busspur
Bus station|Busbahnhof
Fire station|Feuerwache
Train station|Bahnhof
Gas station|Tankstelle
Ghost station|Geisterbahnhof
Fire extinguisher|Feuerlöscher
Smoke detector|Rauchmelder
Carbon monoxide detector|Kohlenmonoxidmelder
Door lock|Türschloss
Security camera|Überwachungskamera
Camera|Kamera
Keyboard|Tastatur
Mouse pad|Mauspad
Screen|Bildschirm
Touchscreen|Touchscreen
Charging port|Ladeanschluss
Charger|Ladegerät
Headphones|Kopfhörer
Earbuds|Ohrhörer
Speaker|Lautsprecher
Microphone|Mikrofon
Battery|Batterie
CPU|Prozessor
Hard drive|Festplatte
Motherboard|Hauptplatine
Graphics card|Grafikkarte
Binoculars|Fernglas
Magnifying glass|Lupe
Telescope|Teleskop
Microscope|Mikroskop
Air pollution|Luftverschmutzung
Water pollution|Wasserverschmutzung
Deforestation|Entwaldung
Global warming|Erderwärmung
Climate change|Klimawandel
Acid rain|Saurer Regen
Drought|Dürre
Solar energy|Sonnenenergie
Wind energy|Windenergie
Kinetic energy|Bewegungsenergie
Potential energy|Potenzielle Energie
Heat|Wärme
Black hole|Schwarzes Loch
Comet|Komet
Asteroid|Asteroid
Star|Stern
The Moon|Mond
Earth|Erde
Cross|Kreuz
Crescent|Halbmond
Stripes|Streifen
Polka dot|Punktemuster
Angle|Winkel
Edge|Kante
Vertex|Scheitelpunkt
Diameter|Durchmesser
Radius|Radius
Circle|Kreis
Square|Quadrat
Triangle|Dreieck
Cube|Würfel
Sphere|Kugel
Cone|Kegel
Comma|Komma
Period|Punkt
Exclamation mark|Ausrufezeichen
Question mark|Fragezeichen
Colon|Doppelpunkt
Semicolon|Semikolon
Equals sign|Gleichheitszeichen
Minus sign|Minuszeichen
Division sign|Divisionszeichen
Bar chart|Balkendiagramm
Line graph|Liniendiagramm
Pie chart|Kreisdiagramm
Scatter plot|Streudiagramm
Black|Schwarz
White|Weiß
Brown|Braun
Blonde|Blond
Red|Rot
Blue|Blau
Green|Grün
Yellow|Gelb
Pink|Rosa
Purple|Violett
Gray|Grau
Grey|Grau
Light blue|Hellblau
Dark blue|Dunkelblau
Baby blue|Babyblau
Light green|Hellgrün
Dark green|Dunkelgrün
Crimson|Karmesinrot
Scarlet|Scharlachrot
Maroon|Kastanienbraun
Braids|Zöpfe
Ponytail|Pferdeschwanz
Bald|Glatze
Haircut|Haarschnitt
Hair colour|Haarfärbung
Hair color|Haarfärbung
Highlights|Strähnchen
Beard trim|Barttrimmen
Bang trim|Pony schneiden
Blood pressure|Blutdruck
Heart rate|Herzfrequenz
Body temperature|Körpertemperatur
Height|Körpergröße
Weight|Gewicht
Age|Alter
Arm length|Armlänge
Arm span|Armspannweite
Body fat|Körperfett
Funeral|Beerdigung
Wedding|Hochzeit
Birthday|Geburtstag
Graduation|Schulabschluss
Christmas|Weihnachten
Christmas Eve|Heiligabend
New Year's Eve|Silvester
New Year's Day|Neujahr
Easter|Ostern
Boxing Day|Zweiter Weihnachtsfeiertag
Phone call|Telefonanruf
Email|E-Mail
Text message|SMS
Video call|Videoanruf
Voice message|Sprachnachricht
Direct message|Direktnachricht
Carrier pigeon|Brieftaube
Rocket mail|Raketenpost
Running|Laufen
Swimming|Schwimmen
Boxing|Boxen
Cycling|Radsport
Archery|Bogenschießen
Wrestling|Ringen
Fencing|Fechten
Rowing|Rudern
Sailing|Segeln
Gymnastics|Turnen
Artistic gymnastics|Geräteturnen
Artistic swimming|Synchronschwimmen
Race walking|Gehen
Trampolining|Trampolinturnen
Weightlifting|Gewichtheben
Athletics|Leichtathletik
Figure skating|Eiskunstlauf
Ice hockey|Eishockey
Table tennis|Tischtennis
Soccer|Fußball
Field hockey|Feldhockey
Water polo|Wasserball
Beach volleyball|Beachvolleyball
Basque pelota|Baskische Pelota
Auto racing|Autorennen
Alpine skiing|Ski Alpin
Skydiving|Fallschirmspringen
Bench press|Bankdrücken
Deadlift|Kreuzheben
Squat|Kniebeuge
Push-up|Liegestütz
Pull-up|Klimmzug
Jumping jacks|Hampelmänner
Calf raise|Wadenheben
Leg curl|Beinbeugen
Front squat|Frontkniebeuge
Box jump|Kastensprung
Free throw|Freiwurf
Layup|Korbleger
Double dribble|Doppeldribbling
Offside|Abseits
Checkmate|Schachmatt
Castling|Rochade
Chess|Schach
Checkers|Dame
Battleship|Schiffe versenken
Connect Four|Vier gewinnt
Chinese checkers|Sternhalma
Hide and seek|Verstecken
Hopscotch|Himmel und Hölle
Knitting|Stricken
Pottery|Töpfern
Sewing|Nähen
Embroidery|Sticken
Painting|Malen|handwerk|hobby|tätigkeit
Sculpture|Bildhauerei|handwerk|hobby|tätigkeit
Guitar|Gitarre
Violin|Violine
Double bass|Kontrabass
Flute|Flöte
Trumpet|Trompete
Trombone|Posaune
Clarinet|Klarinette
Bassoon|Fagott
Harp|Harfe
Drums|Schlagzeug
Accordion|Akkordeon
Bagpipes|Dudelsack
Recorder|Blockflöte
Cowbell|Kuhglocke
Bass drum|Große Trommel
Alto flute|Altflöte
Soprano saxophone|Sopransaxofon
Doctor|Arzt
Dentist|Zahnarzt
Nurse|Pflegekraft
Teacher|Lehrer
Accountant|Buchhalter
Financial advisor|Finanzberater
Investment banker|Investmentbanker
President|Präsident
Cardiology|Kardiologie
Dermatology|Dermatologie
Family medicine|Allgemeinmedizin
Forensic pathology|Forensische Pathologie
Blood pressure monitor|Blutdruckmessgerät
Medical needle|Medizinische Nadel
Scalpel|Skalpell
Ultrasound|Ultraschall
CT scan|Computertomografie
MRI|Magnetresonanztomografie
Chickenpox|Windpocken
Influenza|Grippe
Mumps|Mumps
Measles|Masern
Whooping cough|Keuchhusten
Diabetes|Diabetes
Pine cone|Kiefernzapfen
Oak|Eiche
Pine|Kiefer
Birch|Birke
Beech|Buche
Willow|Weide
Maple|Ahorn
Daisy|Gänseblümchen
Lily|Lilie
Sunflower|Sonnenblume
Feather|Feder
Feathers|Federn
Beak|Schnabel
Claws|Krallen
Antlers|Geweih
Fangs|Fangzähne
Tail|Schwanz
Hooves|Hufe
Fur|Fell
Shell|Schale
Fin|Flosse
Fins|Flossen
Scales|Schuppen
Flesh|Fruchtfleisch|frucht|obst
Pit|Kern
Peel|Schale
Core|Kerngehäuse|frucht|obst
Stem|Stiel
Seed|Samen
Leaves|Blätter
Root|Wurzel
Branch|Ast
Trunk|Stamm|baum|pflanz|holz
`);
add('country',`
United Kingdom|Vereinigtes Königreich
United States|Vereinigte Staaten
United States of America|Vereinigte Staaten von Amerika
Germany|Deutschland
France|Frankreich
Spain|Spanien
Italy|Italien
Austria|Österreich
Switzerland|Schweiz
Netherlands|Niederlande
Belgium|Belgien
Denmark|Dänemark
Sweden|Schweden
Norway|Norwegen
Finland|Finnland
Iceland|Island
Ireland|Irland
Poland|Polen
Czech Republic|Tschechien
Czechia|Tschechien
Slovakia|Slowakei
Slovenia|Slowenien
Croatia|Kroatien
Bosnia and Herzegovina|Bosnien und Herzegowina
Serbia|Serbien
Albania|Albanien
North Macedonia|Nordmazedonien
Greece|Griechenland
Turkey|Türkei
Türkiye|Türkei
Georgia|Georgien
Armenia|Armenien
Azerbaijan|Aserbaidschan
Cyprus|Zypern
Russia|Russland
Belarus|Belarus
Hungary|Ungarn
Romania|Rumänien
Bulgaria|Bulgarien
Moldova|Moldau
Estonia|Estland
Latvia|Lettland
Lithuania|Litauen
Luxembourg|Luxemburg
Vatican City|Vatikanstadt
Canada|Kanada
Mexico|Mexiko
Brazil|Brasilien
Argentina|Argentinien
Bolivia|Bolivien
Colombia|Kolumbien
Dominican Republic|Dominikanische Republik
Cuba|Kuba
Jamaica|Jamaika
Saint Lucia|St. Lucia
Saint Vincent and the Grenadines|St. Vincent und die Grenadinen
Saint Kitts and Nevis|St. Kitts und Nevis
Antigua and Barbuda|Antigua und Barbuda
Trinidad and Tobago|Trinidad und Tobago
Egypt|Ägypten
Algeria|Algerien
Morocco|Marokko
Tunisia|Tunesien
Libya|Libyen
South Africa|Südafrika
South Sudan|Südsudan
Chad|Tschad
Ivory Coast|Elfenbeinküste
Côte d'Ivoire|Elfenbeinküste
Cape Verde|Kap Verde
Cameroon|Kamerun
Central African Republic|Zentralafrikanische Republik
Democratic Republic of the Congo|Demokratische Republik Kongo
DR Congo|Demokratische Republik Kongo
Republic of the Congo|Republik Kongo
Equatorial Guinea|Äquatorialguinea
Ethiopia|Äthiopien
Eritrea|Eritrea
Kenya|Kenia
Tanzania|Tansania
Mozambique|Mosambik
Zimbabwe|Simbabwe
Zambia|Sambia
Seychelles|Seychellen
Comoros|Komoren
Mauritania|Mauretanien
Rwanda|Ruanda
São Tomé and Príncipe|São Tomé und Príncipe
China|China
India|Indien
Pakistan|Pakistan
Saudi Arabia|Saudi-Arabien
United Arab Emirates|Vereinigte Arabische Emirate
Qatar|Katar
Kuwait|Kuwait
Iraq|Irak
Syria|Syrien
Lebanon|Libanon
Yemen|Jemen
Jordan|Jordanien
Kazakhstan|Kasachstan
Kyrgyzstan|Kirgisistan
Tajikistan|Tadschikistan
Turkmenistan|Turkmenistan
Uzbekistan|Usbekistan
Mongolia|Mongolei
North Korea|Nordkorea
South Korea|Südkorea
Indonesia|Indonesien
Philippines|Philippinen
Cambodia|Kambodscha
Singapore|Singapur
Maldives|Malediven
East Timor|Osttimor
Timor-Leste|Osttimor
Australia|Australien
New Zealand|Neuseeland
Papua New Guinea|Papua-Neuguinea
Fiji|Fidschi
Solomon Islands|Salomonen
Marshall Islands|Marshallinseln
Micronesia|Mikronesien
Scotland|Schottland
Greenland|Grönland
Faroe Islands|Färöer
`);
add('language',`
English|Englisch
German|Deutsch
French|Französisch
Spanish|Spanisch
Portuguese|Portugiesisch
Italian|Italienisch
Dutch|Niederländisch
Danish|Dänisch
Swedish|Schwedisch
Norwegian|Norwegisch
Finnish|Finnisch
Icelandic|Isländisch
Irish|Irisch
Welsh|Walisisch
Polish|Polnisch
Czech|Tschechisch
Slovak|Slowakisch
Slovenian|Slowenisch
Croatian|Kroatisch
Serbian|Serbisch
Bosnian|Bosnisch
Albanian|Albanisch
Romanian|Rumänisch
Hungarian|Ungarisch
Bulgarian|Bulgarisch
Greek|Griechisch
Turkish|Türkisch
Russian|Russisch
Ukrainian|Ukrainisch
Belarusian|Belarussisch
Estonian|Estnisch
Latvian|Lettisch
Lithuanian|Litauisch
Maltese|Maltesisch
Catalan|Katalanisch
Basque|Baskisch
Galician|Galicisch
Arabic|Arabisch
Hebrew|Hebräisch
Persian|Persisch
Chinese|Chinesisch
Mandarin|Mandarin
Japanese|Japanisch
Korean|Koreanisch
Vietnamese|Vietnamesisch
Thai|Thailändisch
Burmese|Birmanisch
Indonesian|Indonesisch
Malay|Malaiisch
Balinese|Balinesisch
Javanese|Javanisch
Bengali|Bengalisch
Armenian|Armenisch
Georgian|Georgisch
Mongolian|Mongolisch
Somali|Somali
Latin|Latein
Ancient Greek|Altgriechisch
Ancient Egyptian|Altägyptisch
American Sign Language|Amerikanische Gebärdensprache
British Sign Language|Britische Gebärdensprache
Maltese Sign Language|Maltesische Gebärdensprache
`);
add('place',`
Rome|Rom
Venice|Venedig
Milan|Mailand
Naples|Neapel
Florence|Florenz
Turin|Turin
Genoa|Genua
Vienna|Wien
Prague|Prag
Warsaw|Warschau
Brussels|Brüssel
Copenhagen|Kopenhagen
Athens|Athen
Belgrade|Belgrad
Bucharest|Bukarest
Moscow|Moskau
Lisbon|Lissabon
Beijing|Peking
Tokyo|Tokio
New Delhi|Neu-Delhi
Cairo|Kairo
Cape Town|Kapstadt
Mexico City|Mexiko-Stadt
Munich|München
Cologne|Köln
Nuremberg|Nürnberg
Hanover|Hannover
The Hague|Den Haag
`);
add('film',`
Finding Nemo|Findet Nemo
Finding Dory|Findet Dorie
Inside Out|Alles steht Kopf
Inside Out 2|Alles steht Kopf 2
Monsters, Inc.|Die Monster AG
Monsters University|Die Monster Uni
The Good Dinosaur|Arlo & Spot
A Bug's Life|Das große Krabbeln
Brave|Merida – Legende der Highlands
Up|Oben
Turning Red|Rot
The Incredibles|Die Unglaublichen – The Incredibles
Incredibles 2|Die Unglaublichen 2
Cars|Cars
Cars 2|Cars 2
Cars 3|Cars 3: Evolution
Onward|Onward: Keine halben Sachen
Coco|Coco – Lebendiger als das Leben!
Frozen|Die Eiskönigin – Völlig unverfroren
Frozen II|Die Eiskönigin II
Frozen 2|Die Eiskönigin II
Moana|Vaiana
Moana 2|Vaiana 2
Zootopia|Zoomania
Big Hero 6|Baymax – Riesiges Robowabohu
Tangled|Rapunzel – Neu verföhnt
The Lion King|Der König der Löwen
Beauty and the Beast|Die Schöne und das Biest
Snow White and the Seven Dwarfs|Schneewittchen und die sieben Zwerge
Sleeping Beauty|Dornröschen
The Jungle Book|Das Dschungelbuch
The Little Mermaid|Arielle, die Meerjungfrau
The Princess and the Frog|Küss den Frosch
Treasure Planet|Der Schatzplanet
Atlantis: The Lost Empire|Atlantis – Das Geheimnis der verlorenen Stadt
The Emperor's New Groove|Ein Königreich für ein Lama
Brother Bear|Bärenbrüder
Home on the Range|Die Kühe sind los
Meet the Robinsons|Triff die Robinsons
Wreck-It Ralph|Ralph reichts
Ralph Breaks the Internet|Chaos im Netz
Raya and the Last Dragon|Raya und der letzte Drache
The Fox and the Hound|Cap und Capper
The Rescuers|Bernard und Bianca – Die Mäusepolizei
The Rescuers Down Under|Bernard und Bianca im Känguruland
The Great Mouse Detective|Basil, der große Mäusedetektiv
The Hunchback of Notre Dame|Der Glöckner von Notre Dame
Back to the Future|Zurück in die Zukunft
Saving Private Ryan|Der Soldat James Ryan
The Godfather|Der Pate
Schindler's List|Schindlers Liste
The Shawshank Redemption|Die Verurteilten
The Silence of the Lambs|Das Schweigen der Lämmer
One Flew Over the Cuckoo's Nest|Einer flog über das Kuckucksnest
The Lord of the Rings: The Fellowship of the Ring|Der Herr der Ringe: Die Gefährten
The Lord of the Rings: The Two Towers|Der Herr der Ringe: Die zwei Türme
The Lord of the Rings: The Return of the King|Der Herr der Ringe: Die Rückkehr des Königs
The Martian|Der Marsianer – Rettet Mark Watney
The Notebook|Wie ein einziger Tag
Avatar|Avatar – Aufbruch nach Pandora
`);
add('interface',`
Airplane Mode|Flugmodus
Dark Mode|Dunkelmodus
Do Not Disturb|Nicht stören
Data Roaming|Datenroaming
Low Power Mode|Stromsparmodus
Auto Rotate|Automatisch drehen
24-Hour Time|24-Stunden-Anzeige
Flashlight|Taschenlampe
Flash|Blitz
Location Services|Ortungsdienste
Bluetooth|Bluetooth
Wi-Fi|WLAN
Notifications|Mitteilungen
Copy|Kopieren
Cut|Ausschneiden
Paste|Einfügen
Undo|Rückgängig
Redo|Wiederholen
Save|Speichern
Print|Drucken
Select all|Alles auswählen
Screenshot|Bildschirmfoto
Drafts|Entwürfe
Inbox|Posteingang
Sent|Gesendet
Trash|Papierkorb
Junk|Junk-E-Mail
Archive|Archiv
Outbox|Postausgang
Calculator|Rechner
Calendar|Kalender
Camera|Kamera
Messages|Nachrichten
Contacts|Kontakte
Photos|Fotos
Notes|Notizen
Reminders|Erinnerungen
Settings|Einstellungen
Clock|Uhr
Weather|Wetter
Find My|Wo ist?
Voice Memos|Sprachmemos
Code Scanner|Codescanner
Brightness|Helligkeit
Crop|Zuschneiden
Filters|Filter
Contrast|Kontrast
Saturation|Sättigung
Rotate|Drehen
Resize|Größe ändern
Exposure|Belichtung
Sharpness|Schärfe
Comments|Kommentare
Likes|Gefällt mir
Playlists|Wiedergabelisten
Subscriptions|Abonnements
Watch later|Später ansehen
History|Verlauf
Explore|Entdecken
`);
add('question',`
Nenne ein Küchenkraut oder Gewürz.|Mace|Muskatblüte
Nenne ein Computer-Teil (Zubehör zählt nicht).|Mouse|Maus
Nenne eine Gewichtsklasse im Boxen.|Heavyweight|Schwergewicht
Nenne eine Gewichtsklasse im Boxen.|Lightweight|Leichtgewicht
Nenne eine Gewichtsklasse im Boxen.|Middleweight|Mittelgewicht
Nenne eine Gewichtsklasse im Boxen.|Featherweight|Federgewicht
Nenne eine Gewichtsklasse im Boxen.|Welterweight|Weltergewicht
Nenne eine Figur aus Harry Potter.|Nearly Headless Nick|Fast kopfloser Nick
Nenne eine Figur aus Harry Potter.|Moaning Myrtle|Maulende Myrte
Nenne eine Figur aus Harry Potter.|Kreacher|Kreacher
Nenne einen Ort im Harry-Potter-Universum.|Diagon Alley|Winkelgasse
Nenne einen Ort im Harry-Potter-Universum.|Chamber of Secrets|Kammer des Schreckens
Nenne eine Figur aus der Sesamstraße.|Cookie Monster|Krümelmonster
Nenne eine Figur aus der Sesamstraße.|Big Bird|Bibo
Nenne einen Körperteil, den Tiere haben, aber Menschen nicht.|Aristotle's lantern|Laterne des Aristoteles
Nenne einen Körperteil, den Tiere haben, aber Menschen nicht.|Anal fin|Afterflosse
Nenne einen Planeten oder Zwergplaneten in unserem Sonnensystem.|Mercury|Merkur
Nenne etwas, das verwendet wird, um einen Ball in einem Sport zu schlagen (das gleiche Werkzeug zählt einmal über Sportarten hinweg).|Bat|Schläger
Nenne eine Eissorte (auch Sorbet zählt).|Blue moon|Blue Moon
Nenne einen militärischen Dienstgrad.|Captain|Hauptmann
Nenne eine Ballonart.|Helium balloon|Heliumballon
Nenne eine Ballonart.|Hot air balloon|Heißluftballon
Nenne eine Ballonart.|Water balloon|Wasserballon
Nenne eine Ballonart.|Balloon animal|Ballontier
Nenne eine Ballonart.|Heart balloon|Herzballon
Nenne eine Ballonart.|Number balloon|Zahlenballon
Nenne eine Ballonart.|Weather balloon|Wetterballon
Nenne eine Einstellung, die man in einem Videospiel ändern kann.|Brightness|Helligkeit
Nenne eine Einstellung, die man in einem Videospiel ändern kann.|Sensitivity|Empfindlichkeit
Nenne eine Einstellung, die man in einem Videospiel ändern kann.|Volume|Lautstärke
Nenne eine Einstellung, die man in einem Videospiel ändern kann.|Aim assist|Zielhilfe
Nenne eine Einstellung, die man in einem Videospiel ändern kann.|Camera sensitivity|Kameraempfindlichkeit
Nenne ein Ziel, auf das Spieler in einer Sportart zielen, um zu punkten (z. B. einen Korb).|Goal|Tor
Nenne ein Ziel, auf das Spieler in einer Sportart zielen, um zu punkten (z. B. einen Korb).|Hole|Loch
Nenne ein Ziel, auf das Spieler in einer Sportart zielen, um zu punkten (z. B. einen Korb).|Hoop|Korb
Nenne ein Ziel, auf das Spieler in einer Sportart zielen, um zu punkten (z. B. einen Korb).|Bullseye|Zentrum der Zielscheibe
Nenne ein Ziel, auf das Spieler in einer Sportart zielen, um zu punkten (z. B. einen Korb).|Crossbar|Querlatte
Nenne ein Ziel, auf das Spieler in einer Sportart zielen, um zu punkten (z. B. einen Korb).|Dartboard|Dartscheibe
Nenne eine regelmäßig anfallende Haushaltsrechnung.|Cell phone|Handyrechnung
Nenne eine regelmäßig anfallende Haushaltsrechnung.|Electricity|Stromrechnung
Nenne eine regelmäßig anfallende Haushaltsrechnung.|Gas|Gasrechnung
Nenne eine regelmäßig anfallende Haushaltsrechnung.|Cable TV|Kabelfernsehen
Nenne eine regelmäßig anfallende Haushaltsrechnung.|Car insurance|Autoversicherung
Nenne eine Werbemethode.|Billboard|Werbetafel
Nenne eine Werbemethode.|Flyer|Handzettel
Nenne eine Werbemethode.|Newspaper ad|Zeitungsanzeige
Nenne eine Werbemethode.|Aerial banner|Flugzeugbanner
Nenne eine Werbemethode.|Banner ad|Banneranzeige
Nenne eine Werbemethode.|Brochure|Werbebroschüre
Nenne einen Körperteil unterhalb der Taille.|Ankle|Knöchel
Nenne einen Körperteil unterhalb der Taille.|Buttocks|Gesäß
Nenne einen Körperteil unterhalb der Taille.|Achilles tendon|Achillessehne
Nenne einen Körperteil unterhalb der Taille.|Anterior cruciate ligament|Vorderes Kreuzband
Nenne einen Körperteil unterhalb der Taille.|Big toe|Großer Zeh
Nenne einen Körperteil unterhalb der Taille.|Calf|Wade
Nenne einen Körperteil unterhalb der Taille.|Ball of the foot|Fußballen
`);
// Common answers from Dives 111–117. Exact question scope prevents name collisions.
add('question',`
Nenne eine Art Behälter (Haushaltsgeräte zählen nicht).|Bag|Beutel
Nenne eine Art Behälter (Haushaltsgeräte zählen nicht).|Box|Kiste
Nenne eine Art Behälter (Haushaltsgeräte zählen nicht).|Bucket|Eimer
Nenne eine Art Behälter (Haushaltsgeräte zählen nicht).|Food storage container|Vorratsbehälter
Nenne eine Art Behälter (Haushaltsgeräte zählen nicht).|Jar|Schraubglas
Nenne etwas, das aus der Erde abgebaut wird.|Coal|Kohle
Nenne etwas, das von Natur aus blau ist.|Blue jay|Blauhäher
Nenne etwas, das von Natur aus blau ist.|Ocean|Ozean
Nenne etwas, das von Natur aus blau ist.|Sapphire|Saphir
Nenne etwas, das von Natur aus blau ist.|Sea|Meer
Nenne etwas, das von Natur aus blau ist.|Sky|Himmel
Nenne ein Dessert aus Teig.|Cookie|Keks
Nenne ein Getränk auf Milchbasis.|Hot chocolate|Heiße Schokolade
Nenne ein Getränk auf Milchbasis.|Milkshake|Milchshake
Nenne eine Art Kleid.|Cocktail dress|Cocktailkleid
Nenne eine Art Kleid.|Prom dress|Ballkleid
Nenne eine Art Kleid.|Sundress|Sommerkleid
Nenne eine Art Kleid.|Wedding dress|Hochzeitskleid
Nenne einen emotionalen oder körperlichen Zustand in nur einem Wort.|Angry|Wütend
Nenne einen emotionalen oder körperlichen Zustand in nur einem Wort.|Cold|Kalt
Nenne einen emotionalen oder körperlichen Zustand in nur einem Wort.|Happy|Glücklich
Nenne einen emotionalen oder körperlichen Zustand in nur einem Wort.|Hot|Heiß
Nenne einen emotionalen oder körperlichen Zustand in nur einem Wort.|Hungry|Hungrig
Nenne einen emotionalen oder körperlichen Zustand in nur einem Wort.|Sad|Traurig
Nenne einen emotionalen oder körperlichen Zustand in nur einem Wort.|Scared|Ängstlich
Nenne einen emotionalen oder körperlichen Zustand in nur einem Wort.|Tired|Müde
Nenne etwas, das Menschen als Schutz tragen (normale Alltagskleidung zählt nicht).|Armor|Rüstung
Nenne etwas, das Menschen als Schutz tragen (normale Alltagskleidung zählt nicht).|Goggles|Schutzbrille
Nenne etwas, das Menschen als Schutz tragen (normale Alltagskleidung zählt nicht).|Mask|Maske
Nenne ein gefülltes Lebensmittel.|Dumpling|Teigtasche
Nenne eine Ausdauerübung.|Cycling|Radfahren
Nenne eine Ausdauerübung.|Walking|Walken
Nenne eine rote Sauce, einen roten Dip oder eine rote Würzsoße.|Hot sauce|Scharfe Soße
Nenne eine regelmäßig anfallende Haushaltsrechnung.|Internet|Internetrechnung
Nenne eine regelmäßig anfallende Haushaltsrechnung.|Rent|Miete
Nenne eine regelmäßig anfallende Haushaltsrechnung.|Water|Wasserrechnung
Nenne ein Tier, das sticht.|Scorpion|Skorpion
Nenne ein Tier, das sticht.|Stingray|Stachelrochen
Nenne einen heute lebenden Vogel, der größer als ein Huhn ist.|Peacock|Pfau
Nenne einen heute lebenden Vogel, der größer als ein Huhn ist.|Swan|Schwan
Nenne einen heute lebenden Vogel, der größer als ein Huhn ist.|Turkey|Truthahn
Nenne etwas, das man zu Hause regelmäßig leert.|Litter box|Katzenklo
Nenne etwas, das man zu Hause regelmäßig leert.|Recycling bin|Wertstofftonne
Nenne etwas, das man zu Hause regelmäßig leert.|Trash can|Mülleimer
Nenne eine Werbemethode.|Radio ad|Radiowerbung
Nenne eine Werbemethode.|Social media ads|Werbung in sozialen Medien
Nenne eine Werbemethode.|TV commercial|Fernsehwerbung
Nenne ein Tier, das regelmäßig Insekten oder andere kleine Gliederfüßer frisst (belegte Nahrung).|Anteater|Ameisenbär
Nenne ein Tier, das regelmäßig Insekten oder andere kleine Gliederfüßer frisst (belegte Nahrung).|Bird|Vogel
`);
window.ABGRUND_GERMAN_VOCABULARY=sections;
})();
