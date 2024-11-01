import React, { useState, useEffect } from 'react';
import './Typewriter.css'

const Typewriter = ({ texts }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const currentText = texts[currentTextIndex];

    if (typing) {
      // Typing animation duration
      const typingTimeout = setTimeout(() => {
        setTyping(false);
      }, currentText.length * 75 + 300); // Reduced time to type letters

      return () => clearTimeout(typingTimeout);
    } else {
      // Erasing animation duration, with a delay to switch to the next text
      const erasingTimeout = setTimeout(() => {
        setTyping(true);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length); // Move to next text
      }, currentText.length * 75 + 500); // Longer delay for smooth transition

      return () => clearTimeout(erasingTimeout);
    }
  }, [typing, texts, currentTextIndex]);

  return (
    <span
      className={typing ? 'typing' : 'erasing'}
      style={{ width: typing ? `${texts[currentTextIndex].length}ch` : '0ch' }}
    >
      {texts[currentTextIndex]}
    </span>
  );
};

export default Typewriter
