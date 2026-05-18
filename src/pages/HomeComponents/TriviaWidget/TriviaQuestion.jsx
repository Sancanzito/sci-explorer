// TriviaWidget/TriviaQuestion.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from './TriviaWidgetAnimations';

const TriviaQuestion = ({ question, icon, category }) => {
  return (
    <motion.div variants={itemVariants} className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-2xl">{icon}</div>
        <span className="text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold">
          {category}
        </span>
      </div>
      <p className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
        {question}
      </p>
    </motion.div>
  );
};

export default TriviaQuestion;