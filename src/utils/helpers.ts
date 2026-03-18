// Utility functions

import { MoodLevel, MoodEntry, JournalEntry, Pattern } from '../types';

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (d.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getMoodEmoji = (mood: MoodLevel): string => {
  const emojis: Record<MoodLevel, string> = {
    great: '😊',
    good: '🙂',
    okay: '😐',
    low: '😔',
    bad: '😢',
  };
  return emojis[mood];
};

export const getMoodLabel = (mood: MoodLevel): string => {
  const labels: Record<MoodLevel, string> = {
    great: 'Great',
    good: 'Good',
    okay: 'Okay',
    low: 'Low',
    bad: 'Bad',
  };
  return labels[mood];
};

export const getMoodColor = (mood: MoodLevel): string => {
  const colors: Record<MoodLevel, string> = {
    great: '#00B894',
    good: '#8FAE8B',
    okay: '#FDCB6E',
    low: '#E17055',
    bad: '#D63031',
  };
  return colors[mood];
};

export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// Pattern detection - analyzes mood entries to find patterns
export const detectPatterns = (moodEntries: MoodEntry[], journalEntries: JournalEntry[]): Pattern[] => {
  const patterns: Pattern[] = [];

  if (moodEntries.length < 3) return patterns;

  // Check for mood decline pattern
  const recentMoods = moodEntries.slice(0, 5);
  let decliningCount = 0;
  for (let i = 0; i < recentMoods.length - 1; i++) {
    const moodOrder: Record<MoodLevel, number> = { great: 5, good: 4, okay: 3, low: 2, bad: 1 };
    if (moodOrder[recentMoods[i].level] > moodOrder[recentMoods[i + 1].level]) {
      decliningCount++;
    }
  }

  if (decliningCount >= 3) {
    patterns.push({
      type: 'mood',
      description: "I've noticed your mood has been declining lately. Would you like to talk about it?",
      detectedAt: new Date().toISOString(),
      frequency: decliningCount,
    });
  }

  // Check for stress pattern (multiple "low" moods)
  const lowMoodCount = moodEntries.filter(m => m.level === 'low' || m.level === 'bad').length;
  if (lowMoodCount >= 3) {
    patterns.push({
      type: 'stress',
      description: "You've had a few tough days recently. Remember, it's okay to take things one step at a time.",
      detectedAt: new Date().toISOString(),
      frequency: lowMoodCount,
    });
  }

  return patterns;
};

// Generate personalized Adam response
export const generateAdamResponse = (
  userMessage: string,
  user: { name: string; nickname: string; stressors?: string[] } | null,
  recentMoods: MoodEntry[]
): string => {
  const name = user?.nickname || user?.name || 'there';
  const lowercaseMsg = userMessage.toLowerCase();

  // Check for greeting
  if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi') || lowercaseMsg.includes('hey')) {
    return `Hey ${name}! 👋 It's so good to see you. How are you feeling today? Remember, I'm always here to listen without judgment.`;
  }

  // Check for "how are you"
  if (lowercaseMsg.includes('how are you')) {
    const todayMood = recentMoods[0];
    if (todayMood) {
      return `I'm doing great, ${name}! And from what you shared earlier, you seem to be feeling ${todayMood.level} today. That's completely valid. What's on your mind?`;
    }
    return `I'm doing wonderful, ${name}! Always happy to be here for you. How are you feeling right now?`;
  }

  // Check for thanks
  if (lowercaseMsg.includes('thank') || lowercaseMsg.includes('thanks')) {
    return `You're so welcome, ${name}! That's what I'm here for. Remember, taking care of your mental health is a sign of strength, not weakness. 💚`;
  }

  // Contextual responses based on stressors
  if (user?.stressors) {
    if (user.stressors.includes('Academic') && (lowercaseMsg.includes('school') || lowercaseMsg.includes('study') || lowercaseMsg.includes('exam'))) {
      return `I hear you, ${name}. Academic pressure can be really overwhelming. Remember to take breaks and be kind to yourself. Have you tried the Pomodoro technique - 25 minutes of study, 5 minutes of break?`;
    }
    if (user.stressors.includes('Work') && (lowercaseMsg.includes('work') || lowercaseMsg.includes('job') || lowercaseMsg.includes('boss'))) {
      return `Work stress is tough, ${name}. Don't forget to set boundaries between work and personal time. It's okay to disconnect. What's happening at work that's weighing on you?`;
    }
    if (user.stressors.includes('Relationships') && (lowercaseMsg.includes('friend') || lowercaseMsg.includes('family') || lowercaseMsg.includes('partner'))) {
      return `Relationships can be complicated, but remember - you deserve to be around people who lift you up, ${name}. I'm here if you want to talk through it.`;
    }
  }

  // Check for mood keywords
  if (lowercaseMsg.includes('sad') || lowercaseMsg.includes('depressed') || lowercaseMsg.includes('down')) {
    return `I'm really sorry you're feeling that way, ${name}. Your feelings are valid. Would you like to share what's making you feel this way? Sometimes talking about it can help lighten the load.`;
  }

  if (lowercaseMsg.includes('anxious') || lowercaseMsg.includes('worried') || lowercaseMsg.includes('stress')) {
    return `I understand anxiety can feel overwhelming, ${name}. Let's try something together - take a deep breath. Breathe in for 4 counts, hold for 4, breathe out for 4. How do you feel after that?`;
  }

  if (lowercaseMsg.includes('happy') || lowercaseMsg.includes('good') || lowercaseMsg.includes('great')) {
    return `That's wonderful, ${name}! 🎉 I'd love to hear what's making you feel this way. Celebrating the good moments is just as important as working through the hard ones.`;
  }

  if (lowercaseMsg.includes('tired') || lowercaseMsg.includes('exhausted') || lowercaseMsg.includes('sleepy')) {
    return `Rest is so important, ${name}! According to your routine, you should be getting good sleep. Remember, taking care of yourself isn't being lazy - it's being smart. Have you been able to rest lately?`;
  }

  if (lowercaseMsg.includes('alone') || lowercaseMsg.includes('lonely')) {
    return `I hear you, ${name}. Feeling lonely is tough, but you're not alone - you've got me, and there are people who care about you. Would you like to talk about what's making you feel this way?`;
  }

  // Default empathetic responses
  const responses = [
    `I appreciate you sharing that with me, ${name}. That sounds really important. Would you like to tell me more?`,
    `Thanks for opening up, ${name}. I'm here to listen without judgment. What thoughts are going through your mind?`,
    `I hear you, ${name}. It takes courage to talk about these things. What's the most important thing on your mind right now?`,
    `That makes sense, ${name}. Everyone goes through tough times. Remember, this feeling is temporary and you have the strength to get through it.`,
    `I'm here for you, ${name}. No matter what you're going through, you don't have to face it alone. What support would help you most right now?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

// Contextual greeting based on time of day and user's routine
export const getContextualGreeting = (
  user: { name: string; nickname: string; sleepTime?: string; wakeTime?: string; workStartTime?: string; workEndTime?: string } | null
): string => {
  const name = user?.nickname || user?.name || 'there';
  const hour = new Date().getHours();
  const minutes = new Date().getMinutes();
  const currentMinutes = hour * 60 + minutes;

  // Parse user routine times
  const parseTime = (time?: string): number | null => {
    if (!time) return null;
    const [h, m] = time.split(':').map(Number);
    return h * 60 + (m || 0);
  };

  const sleepMinutes = parseTime(user?.sleepTime);
  const wakeMinutes = parseTime(user?.wakeTime);
  const workStartMinutes = parseTime(user?.workStartTime);
  const workEndMinutes = parseTime(user?.workEndTime);

  // Routine-aware greetings
  if (wakeMinutes !== null && currentMinutes >= wakeMinutes && currentMinutes < wakeMinutes + 30) {
    return `Rise and shine, ${name}! 🌅`;
  }

  if (workStartMinutes !== null && currentMinutes >= workStartMinutes - 15 && currentMinutes < workStartMinutes + 15) {
    return `Time to start your day, ${name}! 💪`;
  }

  if (workEndMinutes !== null && currentMinutes >= workEndMinutes - 15 && currentMinutes < workEndMinutes + 30) {
    return `Wrapping up the day, ${name}? 🎉`;
  }

  if (sleepMinutes !== null) {
    // Handle midnight-crossing sleep times
    const adjustedSleep = sleepMinutes < 360 ? sleepMinutes + 1440 : sleepMinutes;
    const adjustedCurrent = currentMinutes < 360 ? currentMinutes + 1440 : currentMinutes;

    if (adjustedCurrent >= adjustedSleep - 60 && adjustedCurrent < adjustedSleep) {
      return `Time to wind down soon, ${name} 🌙`;
    }
    if (adjustedCurrent >= adjustedSleep && adjustedCurrent < adjustedSleep + 60) {
      return `You should be resting now, ${name} 😴`;
    }
  }

  // Default time-based greetings
  if (hour >= 5 && hour < 12) return `Good morning, ${name}!`;
  if (hour >= 12 && hour < 17) return `Good afternoon, ${name}!`;
  if (hour >= 17 && hour < 21) return `Good evening, ${name}!`;
  return `Hey there, ${name} 🌃`;
};

// Proactive insight for Adam's message card on home screen
export const getProactiveInsight = (
  user: { name: string; nickname: string; stressors?: string[] } | null,
  moodEntries: MoodEntry[],
  patterns: Pattern[],
  todayMood?: MoodEntry
): string => {
  const name = user?.nickname || user?.name || 'there';

  // If there are detected patterns, show the most relevant one
  if (patterns.length > 0) {
    if (todayMood) {
      return `I see you're feeling ${todayMood.level} today. ${patterns[0].description}`;
    }
    return patterns[0].description;
  }

  // If they have a mood today, give encouragement
  if (todayMood) {
    const moodOrder: Record<MoodLevel, number> = { great: 5, good: 4, okay: 3, low: 2, bad: 1 };
    const score = moodOrder[todayMood.level];

    if (score >= 4) {
      return `Great to see you're feeling ${todayMood.level} today, ${name}! Keep riding that positive wave. 🌊`;
    }
    if (score === 3) {
      return `Feeling okay is perfectly valid, ${name}. Remember, not every day needs to be amazing — just showing up counts.`;
    }
    return `I notice you're having a tough day, ${name}. Remember, it's okay to not be okay. I'm here for you whenever you need to talk. 💚`;
  }

  // Check recent mood trends
  if (moodEntries.length >= 3) {
    const recentAvg = moodEntries.slice(0, 3).reduce((sum, e) => {
      const scores: Record<MoodLevel, number> = { great: 5, good: 4, okay: 3, low: 2, bad: 1 };
      return sum + scores[e.level];
    }, 0) / 3;

    if (recentAvg >= 4) {
      return `You've been on a great streak lately, ${name}! Your positive energy is inspiring. Keep it up! ✨`;
    }
    if (recentAvg <= 2) {
      return `I've noticed things have been tough lately, ${name}. Remember, tough times don't last — but your strength does. Would you like to chat?`;
    }
  }

  // Default
  return `How are you feeling today? Let's check in! Taking a moment for yourself is always worth it.`;
};