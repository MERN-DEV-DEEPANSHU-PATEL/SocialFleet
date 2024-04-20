import React, { useState, useEffect, useContext } from "react";
import "./StoryCarousel.scss";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Story from "./Story";
import Img from "../Img";
import { AuthContext } from "../../context/authContext";

const StoryCarousel = ({
  users,
  setOpenStories,
  initialIndex,
  handleDeleteStory,
}) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialIndex);
  const [imageIndex, setImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // State for pausing/resuming the timer

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        if (users[currentUserIndex].activeStories.length - 1 === imageIndex) {
          handleNextUser();
        } else {
          handleNextImage();
        }
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [imageIndex, currentUserIndex, isPaused]);

  const handleNextUser = () => {
    if (users.length - 1 === currentUserIndex) {
      setOpenStories(false);
    } else {
      setCurrentUserIndex((prevIndex) => prevIndex + 1);
      setImageIndex(0);
      setProgress(0); // Reset progress when moving to the next user
    }
  };

  const handlePrevious = () => {
    setCurrentUserIndex((prevIndex) =>
      prevIndex === 0 ? users.length - 1 : prevIndex - 1
    );
    setImageIndex(0);
    setProgress(0); // Reset progress when moving to the previous user
  };

  const handleImageClick = () => {
    // Move to the next image or next user
    console.log("image clicked");
    if (users[currentUserIndex].activeStories.length > 1) {
      handleNextImage();
    } else {
      handleNextUser();
    }
  };

  const handleNextImage = () => {
    if (users[currentUserIndex].activeStories.length - 1 === imageIndex) {
      handleNextUser();
    } else {
      setProgress(0);
      setImageIndex((index) => index + 1);
    }
  };

  const handlePauseResume = () => {
    setIsPaused((prevState) => !prevState);
  };

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setTimeout(() => {
        setProgress((prevProgress) => prevProgress + 2.5);
        if (progress === 100) {
          setProgress(0);
        }
      }, 100);
    }
    return () => {
      clearTimeout(interval);
    };
  }, [progress, isPaused]);

  return (
    <div className="stories-view">
      <button onClick={() => setOpenStories(false)} className="closeIcon">
        <CloseIcon />
      </button>
      <div className="carousel">
        <Story
          imgSrc={users[currentUserIndex].profilePic}
          username={
            currentUserIndex === 0
              ? "Your Stories"
              : users[currentUserIndex].username
          }
        />
        {/* Displaying stories of the currently selected user */}
        {/* Display the image carousel */}
        <div className="ontapcarousel" onClick={handleImageClick}>
          <Img
            isDefault={false}
            src={users[currentUserIndex].activeStories[imageIndex].media}
            alt={"story of user"}
          />
          {progress > 0 && (
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          )}
        </div>
        <div className="additional-buttons">
          <button onClick={handlePauseResume}>
            {isPaused ? "Resume" : "Pause"}
          </button>
          {currentUser.username === users[currentUserIndex].username && (
            <button
              onClick={() =>
                handleDeleteStory(
                  users[currentUserIndex].activeStories[imageIndex].id
                )
              }
            >
              Delete Story
            </button>
          )}
        </div>
      </div>
      <div className="navigation-buttons">
        {currentUserIndex !== 0 && (
          <button className="left" onClick={handlePrevious}>
            <KeyboardArrowLeftIcon />
          </button>
        )}
        {currentUserIndex !== users.length - 1 && (
          <button className="right" onClick={handleNextUser}>
            <KeyboardArrowRightIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryCarousel;
