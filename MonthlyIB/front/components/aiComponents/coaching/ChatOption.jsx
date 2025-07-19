import React, { useState } from "react";
import styles from "./ChatOption.module.css";

const ChatOption = ({ options, onSelect }) => {
  const [showAll, setShowAll] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const visibleOptions = showAll ? options : options.slice(0, 10);

  const handleClick = (opt) => {
    if (hasClicked) return;
    onSelect(opt);
    setHasClicked(true);
    setSelectedOption(opt);
  };

  return (
    <div className={styles.chatOptions}>
      {visibleOptions.map((opt, idx) => (
        <button
          key={idx}
          className={`${styles.optionButton} ${selectedOption === opt ? styles.selectedOption : ""}`}
          onClick={() => handleClick(opt)}
          disabled={hasClicked}
        >
          {opt}
        </button>
      ))}
      {options.length > 10 && (
        <button
          className={styles.moreButton}
          onClick={() => setShowAll(prev => !prev)}
        >
          {showAll ? "접기" : "더보기"}
        </button>
      )}
    </div>
  );
}

export default ChatOption;