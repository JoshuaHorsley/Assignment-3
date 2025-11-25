/* 
 *  FILE          : SolarSystem.js
 *  PROJECT       : SENG-3040 – Assignment 3 (Solar System)
 *  PROGRAMMER    : Josh Horsley
 *  FIRST VERSION : 2025-11-24
 *  DESCRIPTION   :
 *    This file defines the SolarSystem class and encapsulates all 
 *    variables, constants, and drawing logic for a 3D solar system model 
 *    in p5.js.  
 */

//-------------------------------------------------------------
// CLASS : SolarSystem
// PURPOSE :
//   Encapsulates the entire simulation (stars, sun, planets) 
//   and provides setup(), draw(), and internal helper functions.
//-------------------------------------------------------------
class SolarSystem
{
    /*---------------------------------------------------------
     *  FUNCTION      : constructor
     *  DESCRIPTION   :
     *    Initializes constants, object properties, and random
     *    star positions.  The constructor does not depend on
     *    global variables; all state remains internal.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    constructor()
    {
        //--- constants (use uppercase, avoid magic numbers)
        this.CANVAS_SIZE = 700;
        this.STAR_COUNT = 100;
        this.SUN_RADIUS = 30;
        this.EARTH_RADIUS = 15;
        this.EARTH_ORBIT_RADIUS = 200;
        this.EARTH_ORBIT_SPEED = 0.01;
        this.EARTH_ROTATION_SPEED = 0.03;
        this.MOON_RADIUS = 6;
        this.MOON_ROTATION_SPEED = 0.00;
        this.MOON_ORBIT_RADIUS = 50;
        this.MOON_ORBIT_SPEED = 0.02;

        //--- private data members
        this.stars = [];
        this.earthTexture = null;
        this.moonTexture = null;
        this.earthAngle = 0.0;
        this.moonAngle = 0.0;

        // GUI Elements
        this.starCountInput = null;
        this.earthDistanceLabel = null;
        this.updateStarsButton = null;
        this.earthDistanceSlider = null;
        this.earthRotationSpeedLabel = null;
        this.earthRotationSpeedSlider = null;

        this.moonDistanceLabel = null;
        this.moonDistanceSlider = null;

        // Custom Planets GUI
        this.customPlanets = [];

        this.planetRadiusSlider = null;
        this.planetColorInput = null;
        this.planetOrbitSpeedSlider = null;
        this.planetDistanceSlider = null;
        this.planetHasMoonCheckbox = null;
        this.planetMoonRadiusSlider = null;
        this.planetMoonDistanceSlider = null;
        this.planetMoonOrbitSpeedSlider = null;
        this.createPlanetButton = null;

    }

    /*---------------------------------------------------------
     *  FUNCTION      : preloadAssets
     *  DESCRIPTION   :
     *    Loads external image textures.  Called from the 
     *    p5.js preload() phase before setup() executes.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    preloadAssets()
    {
        // Try loading from assets folder first
        this.earthTexture = loadImage(
            'assets/earth.jpg',
            () => { console.log('Earth texture loaded successfully'); },
            () => {
                console.log('Texture not found – using solid color fallback.');
                this.earthTexture = null;
            }
        );

        this.moonTexture = loadImage(
            'assets/moon.jpg',
            () => { console.log('Moon texture loaded successfully'); },
            () => {
                console.log('Texture not found – using solid color fallback.');
                this.moonTextureTexture = null;
            }
        );
    }


    /*---------------------------------------------------------
     *  FUNCTION      : setup
     *  DESCRIPTION   :
     *    Creates the canvas, generates the starfield once, and
     *    sets drawing modes for texture rendering.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    setup()
    {
        createCanvas(this.CANVAS_SIZE, this.CANVAS_SIZE, WEBGL);
        this.EARTH_EARTH_ORBIT_RADIUS = 120;  // smaller orbit so Earth is close to center
        this.EARTH_RADIUS = 20;   // slightly larger for visibility

        
        this.starCountInput = createInput('100');
        this.starCountInput.position(this.CANVAS_SIZE + 20, 20);

        this.updateStarsButton = createButton ('Update Stars');
        this.updateStarsButton.position(this.CANVAS_SIZE + 20, 50);
        this.updateStarsButton.mousePressed(() => {
          let newCount = this.starCountInput.value();
          newCount = int(newCount);
          this.STAR_COUNT = newCount;
          this.generateStars();

        });

        // Earth distance from the Sun slider
        this.earthDistanceLabel = createP('Earth Distance from Sun');
        this.earthDistanceLabel.position(this.CANVAS_SIZE + 20, 60);
        this.earthDistanceSlider = createSlider(50, 350, this.EARTH_EARTH_ORBIT_RADIUS)
        this.earthDistanceSlider.position(this.CANVAS_SIZE + 20, 90);
        
        // Earth rotation speed slider
        this.earthRotationSpeedLabel = createP('Earth Rotation Speed');
        this.earthRotationSpeedLabel.position(this.CANVAS_SIZE + 20, 110);
        this.earthRotationSpeedSlider = createSlider(0.00, 0.20, this.EARTH_ROTATION_SPEED, 0.001);
        this.earthRotationSpeedSlider.position(this.CANVAS_SIZE + 20, 140);

        this.moonDistanceLabel = createP('Moon Distance from Earth');
        this.moonDistanceLabel.position(this.CANVAS_SIZE + 20, 170);
        this.moonDistanceSlider = createSlider(25, 100, this.MOON_EARTH_ORBIT_RADIUS)
        this.moonDistanceSlider.position(this.CANVAS_SIZE + 20, 200);

        this.moonRotationSpeedLabel = createP('Moon Rotation Speed');
        this.moonRotationSpeedLabel.position( this.CANVAS_SIZE + 20, 230);
        this.moonRotationSpeedSlider = createSlider(0.00, 0.20, this.MOON_ROTATION_SPEED, 0.001);
        this.moonRotationSpeedSlider.position(this.CANVAS_SIZE + 20, 260);

        // ---- PLANET CREATION GUI ----
        // Section header
        this.planetSectionLabel = createP('--- Create Custom Planet ---');
        this.planetSectionLabel.position(this.CANVAS_SIZE + 20, 280);

        // Planet radius
        this.planetRadiusLabel = createP('Planet Radius');
        this.planetRadiusLabel.position(this.CANVAS_SIZE + 20, 310);
        this.planetRadiusSlider = createSlider(5, 30, 15);
        this.planetRadiusSlider.position(this.CANVAS_SIZE + 20, 340);

        // Planet color
        this.planetColorLabel = createP('Planet Color (hex)');
        this.planetColorLabel.position(this.CANVAS_SIZE + 20, 360);
        this.planetColorInput = createInput('#FF5500');
        this.planetColorInput.position(this.CANVAS_SIZE + 20, 400);

        // Planet orbit speed
        this.planetOrbitSpeedLabel = createP('Planet Orbit Speed');
        this.planetOrbitSpeedLabel.position(this.CANVAS_SIZE + 20, 420);
        this.planetOrbitSpeedSlider = createSlider(0.001, 0.05, 0.01, 0.001);
        this.planetOrbitSpeedSlider.position(this.CANVAS_SIZE + 20, 450);

        // Planet distance from sun
        this.planetDistanceLabel = createP('Planet Distance from Sun');
        this.planetDistanceLabel.position(this.CANVAS_SIZE + 20, 470);
        this.planetDistanceSlider = createSlider(100, 400, 250);
        this.planetDistanceSlider.position(this.CANVAS_SIZE + 20, 500);

        // Has moon checkbox
        this.planetHasMoonLabel = createP('Planet Has Moon?');
        this.planetHasMoonLabel.position(this.CANVAS_SIZE + 20, 510);
        this.planetHasMoonCheckbox = createCheckbox('', false);
        this.planetHasMoonCheckbox.position(this.CANVAS_SIZE + 20, 550);

        // Moon radius
        this.planetMoonRadiusLabel = createP('Moon Radius');
        this.planetMoonRadiusLabel.position(this.CANVAS_SIZE + 20, 560);
        this.planetMoonRadiusSlider = createSlider(3, 15, 6);
        this.planetMoonRadiusSlider.position(this.CANVAS_SIZE + 20, 590);

        // Moon distance
        this.planetMoonDistanceLabel = createP('Moon Distance');
        this.planetMoonDistanceLabel.position(this.CANVAS_SIZE + 20, 610);
        this.planetMoonDistanceSlider = createSlider(20, 80, 40);
        this.planetMoonDistanceSlider.position(this.CANVAS_SIZE + 20, 640);

        // Moon orbit speed
        this.planetMoonOrbitSpeedLabel = createP('Moon Orbit Speed');
        this.planetMoonOrbitSpeedLabel.position(this.CANVAS_SIZE + 20, 660);
        this.planetMoonOrbitSpeedSlider = createSlider(0.001, 0.1, 0.03, 0.001);
        this.planetMoonOrbitSpeedSlider.position(this.CANVAS_SIZE + 20, 690);

        // Create button
        this.createPlanetButton = createButton('Create Planet');
        this.createPlanetButton.position(this.CANVAS_SIZE + 20, 720);

        this.createPlanetButton.mousePressed(()=>{

          let newPlanet = {
            radius: this.planetRadiusSlider.value(),
            color: this.planetColorInput.value(),
            orbitSpeed: this.planetOrbitSpeedSlider.value(),
            orbitRadius: this.planetDistanceSlider.value(),
            angle: 0, 
            hasMoon: this.planetHasMoonCheckbox.checked(),
            moon: null 
          };

          if (newPlanet.hasMoon) {
            newPlanet.moon = {
              radius: this.planetMoonRadiusSlider.value(),
              orbitRadius: this.planetMoonDistanceSlider.value(),
              orbitSpeed: this.planetMoonOrbitSpeedSlider.value(),
              angle: 0
            };
          }

          this.customPlanets.push(newPlanet);
          console.log('Planet created!', newPlanet);

        });


        this.generateStars();



        noStroke();
        textureMode(NORMAL);
    }

    /*---------------------------------------------------------
     *  FUNCTION      : update
     *  DESCRIPTION   :
     *    Updates simulation angles and any time-dependent 
     *    motion variables.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    update()
    {
        this.earthAngle += this.EARTH_ORBIT_SPEED;
        this.moonAngle += this.MOON_ORBIT_SPEED;
        this.EARTH_ORBIT_RADIUS = this.earthDistanceSlider.value();
        this.EARTH_ROTATION_SPEED = this.earthRotationSpeedSlider.value();
        this.MOON_ORBIT_RADIUS = this.moonDistanceSlider.value();
        this.MOON_ROTATION_SPEED = this.moonRotationSpeedSlider.value();

        for (let planet of this.cutomPlanets) {
          planet.angle +=orbitSpeed;
          if (planet.hasMoon) {
            planet.moon.angle += planet.moon.orbitSpeed;
          }
        }
    }

    /*---------------------------------------------------------
     *  FUNCTION      : drawScene
     *  DESCRIPTION   :
     *    Renders the starfield, Sun, and Earth to the screen.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    drawScene()
    {
        console.log(this.earthAngle);
        console.log(this.moonAngle);

        background(0);
        this.drawStars();
        this.drawSun();
        this.drawEarth();
        this.drawMoon()
    }

    generateStars()
    {
      this.stars = [];
        // Generate static star positions
      for (let i = 0; i < this.STAR_COUNT; i++)
      {
        let x = random(-width / 2, width / 2);
        let y = random(-height / 2, height / 2);
          
        // if star is too close to the sun try again;
        let distance = sqrt(x*x + y*y);
        if (distance < 40) 
          {
            i--;
            continue;
          }

          let z = random(-300, 300);
          this.stars.push(createVector(x, y, z));
      }
    }

    /*---------------------------------------------------------
     *  FUNCTION      : drawStars
     *  DESCRIPTION   :
     *    Draws static background stars.  Each star is rendered
     *    as a small white sphere.  Stars are generated once in 
     *    setup() and remain fixed.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    drawStars()
    {
        push();
        stroke(255);
        strokeWeight(3);

        for (let s of this.stars)
        {
            push();
            translate(s.x, s.y, s.z);
            point(0,0,0);
            pop();
        }

        pop();
    }

    /*---------------------------------------------------------
     *  FUNCTION      : drawSun
     *  DESCRIPTION   :
     *    Renders the central Sun as a bright yellow sphere.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    drawSun()
    {
        push();
        fill(255, 204, 0);
        sphere(this.SUN_RADIUS);
        pop();
    }

    /*---------------------------------------------------------
     *  FUNCTION      : drawEarth
     *  DESCRIPTION   :
     *    Renders an Earth sphere orbiting the Sun and rotating
     *    on its own axis.  If the texture is unavaiLabel, a 
     *    solid blue fill is used instead.
     *  PARAMETERS    : None
     *  RETURNS       : None
     *---------------------------------------------------------*/
    drawEarth()
    {
        push();

        // --- Calculate Earth’s orbit position around the Sun ---
        let earthX = cos(this.earthAngle) * this.EARTH_ORBIT_RADIUS;
        let earthY = sin(this.earthAngle) * this.EARTH_ORBIT_RADIUS;
        translate(earthX, earthY, 0);

        // --- Tilt and rotate the Earth around its axis ---
        rotateY(frameCount * this.EARTH_ROTATION_SPEED);

        // --- Safe texture handling ---
        if (this.earthTexture && this.earthTexture.width > 0)
        {
            // If the texture loaded successfully
            texture(this.earthTexture);
        }
        else
        {
            // Fallback to solid color rendering
            noTexture();                 // ensure p5 switches out of texture mode
            fill(0, 102, 255);           // bright blue fallback
        }

        // --- Draw Earth as a sphere ---
        noStroke();
        sphere(this.EARTH_RADIUS);

        pop();
    }

        drawMoon()
    {
        push();

        // --- Calculate Earth’s orbit position around the Sun ---
        let earthX = cos(this.earthAngle) * this.EARTH_ORBIT_RADIUS;
        let earthY = sin(this.earthAngle) * this.EARTH_ORBIT_RADIUS;
        translate(earthX, earthY, 0);

        // --- Calculate the Moon's orbit positon around earth ---
        let moonX = cos(this.moonAngle) * this.MOON_ORBIT_RADIUS;
        let moonY = sin(this.moonAngle) * this.MOON_ORBIT_RADIUS;
        translate(moonX, moonY, 0)
        rotateY(frameCount * this.MOON_ROTATION_SPEED);

        // --- Safe texture handling ---
        if (this.moonTexture && this.moonTexture.width > 0)
        {
            // If the texture loaded successfully
            texture(this.moonTexture);
        }
        else
        {
            // Fallback to solid color rendering
            noTexture();                 // ensure p5 switches out of texture mode
            fill(200);           // grey fallback
        }

        // --- Draw the moon as a sphere ---
        noStroke();
        sphere(this.MOON_RADIUS);

        pop();
    }

    drawCustomPlanets()
    {
      for (let planet of this.customPlanets) {
        //Draw the planet
      }
    }


}

//-------------------------------------------------------------
// p5.js Integration Section
// These three functions act as the “puppet master,” similar 
// to a main() function that delegates to the SolarSystem object.
//-------------------------------------------------------------

let solarSystemApp;  // single object instance (minimal global)

/*---------------------------------------------------------
 *  FUNCTION      : preload
 *  DESCRIPTION   :
 *    Invoked automatically by p5.js before setup().
 *    Delegates asset loading to the SolarSystem instance.
 *---------------------------------------------------------*/
function preload()
{
    solarSystemApp = new SolarSystem();
    solarSystemApp.preloadAssets();
}

/*---------------------------------------------------------
 *  FUNCTION      : setup
 *  DESCRIPTION   :
 *    Invoked once by p5.js.  Calls setup() on the main object.
 *---------------------------------------------------------*/
function setup()
{
    solarSystemApp.setup();
}

/*---------------------------------------------------------
 *  FUNCTION      : draw
 *  DESCRIPTION   :
 *    Invoked repeatedly by p5.js (~60 fps).  Updates and draws
 *    the solar system scene.
 *---------------------------------------------------------*/
function draw()
{
    solarSystemApp.update();
    solarSystemApp.drawScene();
}