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
        this.MOON_ORBIT_RADIUS = 50;
        this.MOON_ORBIT_SPEED = 0.02;

        //--- private data members
        this.stars = [];
        this.earthTexture = null;
        this.moonTexture = null;
        this.earthAngle = 0.0;
        this.moonAngle = 0.0;
        this.starCountInput = null;
        this.earthDistanceLable = null;
        this.updateStarsButton = null;
        this.earthDistanceSlider = null;
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

        this.earthDistanceLable = createP('Earth Distance from Sun');
        this.earthDistanceLable.position(this.CANVAS_SIZE +20, 60);
        this.earthDistanceSlider = createSlider(50, 350, this.EARTH_EARTH_ORBIT_RADIUS)
        this.earthDistanceSlider.position(this.CANVAS_SIZE + 20, 90);

        

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
     *    on its own axis.  If the texture is unavailable, a 
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