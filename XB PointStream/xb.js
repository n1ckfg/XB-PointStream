import processing.opengl.*;
int ii=0;
float r = 0.0f;

Octree octree;

class Point{
  public float x,y,z;
  Point(float xx, float yy, float zz){
    x = xx;
    y = yy;
    z = zz;
  }
  Point(){
    x = y = z;
  }
}

class Bounds{
  Point center;
  float radius;
  Bounds(){
    radius = 0.0f;
  }
}


class Octree{
  
  // When the data is rendered, render the bounds as well?
  private boolean showBounds;
  
  // position of the octant
  private Point center;
  
  //
  private float radius;
  
  // This implementation isn't a complete tree, therefore
  // some parents may have less than 8 children.
  private ArrayList children;
  
  private int numChildren;
  
  // Once the octree is built, it can be rendered. Building
  // is the process of subdividing the root node and 
  // recursively subdividing the children.
  private boolean isBuilt;
  
  // The actual data stored in the octant. If this is a leaf node,
  // it will contain data, otherwise it exists only as a means
  // for hierarchical structure.
  private ArrayList data;
  
  Octree(float fsize){
    showBounds = true;
    numChildren = 0;
    radius = fsize;
    isBuilt = false;
    center = new Point();
  }
  
  void render(){
    if(isBuilt){
      
      if(showBounds){
        pushMatrix();
        translate(center.x, center.y, center.z);
        box(radius, radius, radius);
        popMatrix();
      }
    
      if(numChildren > 0){
        for(int i = 0; i < numChildren; i++){
          Octree o = (Octree)children.get(i);
          o.render();
        }
      }
    }
  }
  
  boolean getShowBounds(){
    return showBounds;
  }
  
  void setShowBounds(boolean show){
    showBounds = show;
  }
  
  void setCenter(Point pp){
    center = pp;
  }
  
  float getRadius(){
    return radius;
  }
  
  void setRadius(float r){
    radius = r;
  }
  
  void addPoint(float x, float y, float z){
    println("add point");
  }
  
  void build(int maxDepth){
    isBuilt = true;
    
    // We have reached the maximum depth for creating children,
    // so stop creating them.
    if(maxDepth <= 0){
      return;
    }
    
    else{
      children = new ArrayList();
      numChildren = 8;
    
      for(int i = 0; i < 8; i++){
        Point p = new Point();
        
        switch(i){
          case 0: p.x = -1;  p.y =  1; p.z =  1;break;
          case 1: p.x = -1;  p.y = -1; p.z =  1;break;
          case 2: p.x =  1;  p.y = -1; p.z =  1;break;
          case 3: p.x =  1;  p.y =  1; p.z =  1;break;
          case 4: p.x = -1;  p.y =  1; p.z = -1;break;
          case 5: p.x = -1;  p.y = -1; p.z = -1;break;
          case 6: p.x =  1;  p.y = -1; p.z = -1;break;
          case 7: p.x =  1;  p.y =  1; p.z = -1;break;
        }
        
        p.x *= radius/4.0f;
        p.y *= radius/4.0f;
        p.z *= radius/4.0f;
        
        Octree octree = new Octree(radius);
        octree.setCenter(p);
        octree.setRadius(radius/2.0f);
        octree.build(maxDepth-1);
        children.add(octree);
        ii++;
      }
    }
  }
}


void setup() {
  size(500, 500, OPENGL);
  strokeWeight(10);

   noFill();
   stroke(0,200,0);
   strokeWeight(1);

  background(200);
  //runTest(10000);
  
  // A tree with depth 0 has no direct children
  // A tree with depth 1 has 8 direct children
  // etc ...
  
  octree = new Octree(250);
  octree.build(1);
  
  println(ii);
  octree.render();
}

void draw(){
  background(0);
  translate(width/2, height/2, 0);
 // rotateY(r+=0.01);
  octree.render();
}

int runTest(int numPoints){
  background(200);
  
  ArrayList arr = new ArrayList();

  for(int i = 0; i < numPoints; i++)
  {
    PVector p = new PVector();
    p.set(random(-1,1), random(-1,1), random(-1,1));
    p.normalize();
    p.mult(200);
    arr.add(p.x);
    arr.add(p.y);
    arr.add(p.z);
  }
  
  strokeWeight(10);
  int timer = millis();
  for(int i=0; i < numPoints*3; i+=3){
    float x = (Float) arr.get(i);
    float y = (Float) arr.get(i+1);
    float z = (Float) arr.get(i+2);
    
    point(x, y, z);
  }
  return millis()-timer;
}
