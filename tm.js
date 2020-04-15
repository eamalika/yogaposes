//start verifying only after button is pressed

let canvas;
let video;
let classifier;
let flippedVideo;

let label = "waiting...";
let modelText = "model.json";

let loadingRectWidth;
let button;

function preload() {
  //add a link to your own trained model
  classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/StDbNivDY/' + modelText);

  //create an array of dog image file names
  possible_pose_images = [
    "images/child.png",
    "images/dog.png",
    "images/forwardfold.png",
    "images/halflift.png",
    "images/lotus.png",
    "images/mountain.png",
    "images/warrior.png"
  ];
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  //create the video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  //flip the video feed
  flippedVideo = ml5.flipImage(video);

  //run the classify video function
  classifyVideo();

  loadingRectWidth = 0;

  //pick a random pose image
  pos = floor(random(possible_pose_images.length));
  //load the picked image
  pose = loadImage(possible_pose_images[pos]);

  //button to change pose
  button = createButton('skip pose');
  button.position(width - 100, height - 100);
  button.mousePressed(changePose);

}

function changePose(){
  //pick a random pose image
  pos = floor(random(possible_pose_images.length));
  //load the picked image
  pose = loadImage(possible_pose_images[pos]);

  imageMode(CORNER);
  image(pose, 16, 16, 480, 280);


}

function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  //what are we going to classify? The video. When that is ready call the
  //gotResults function to update the label
  classifier.classify(flippedVideo, gotResults);
}


function gotResults(error, results) {
  if (error) {
    console.log(error);
    return;
  }
  //label is the first in the array, which is the most likely label
  label = results[0].label;
  //after we get the new label,
  //we call classifyVideo again to analyze the video and update the label
  classifyVideo();
  // console.log(results);
}

function checkPose(){

  console.log(loadingRectWidth, windowWidth);
}


function draw() {
  imageMode(CENTER);
  background(0);
  image(video, width / 2, height / 2, windowWidth, windowHeight);

  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);

  imageMode(CORNER);
  image(pose, 16, 16, 480, 280);

  //draw the label on teh canvas
  text(label, width / 2, height - 60);

  if ('images/' + label+'.png' == possible_pose_images[pos] ) {
    if (loadingRectWidth + 10 < windowWidth){
      loadingRectWidth = loadingRectWidth + 10;
      fill(0, 128, 0);
      rect(0, height - 16, loadingRectWidth, 20);
    }
    else if(loadingRectWidth >= windowWidth) {
      console.log('got it');
      changePose();
    }
  } else {
    loadingRectWidth = 0;
  }




}
