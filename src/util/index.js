const getFirstInitial = name => (
  name.charAt(0).toUpperCase()
);

const avatarColors = [
  '#64b4f2', '#7690f4', '#b075ed', '#dd81e8', '#f77292',
  '#e25552', '#f67d42', '#ffac48', '#ffc948', '#fcdb51',
  '#e9e45b', '#b0dd61', '#7fc661', '#5bd69a', '#73e2e1',
];

const getAvatarColor = nickname => { 
  const numberDigest = djb2Hash(nickname); 
  const numberOfColors = avatarColors.length; 
  const index = Math.abs(numberDigest % numberOfColors); 
  return avatarColors[index]; 
};

const djb2Hash = str => {
  let hash = 5381;
  for (const char in str) { 
    const charCode = char.charCodeAt(0); 
    hash = (hash << 5) + hash + charCode; 
  }
  return hash;
};

let str = "[[Biffle]] started a convo with [[Baffle]]";

const parseUserNames = (string, parts) => {
  console.log(string.replace(/[[(.*)]]/g, '<strong>$&</strong>'));

  // Kenny's code
  // if (string.length === 0) {
  //   return parts;
  // }
  // let stringStart = 0;
  // const nicknameStart = string.indexOf('[[', stringStart) + 2;
  // const nicknameEnd = string.indexOf(']]', nicknameStart);
  // stringStart = nicknameEnd;
  // const newNickname = string.slice(nicknameStart, nicknameEnd);
  // parts.push(newNickname);
  // string = string.slice(0, nicknameEnd);
  // parseUserName(string, parts);
  // console.log(parts)

  // My attempt
  // let stringStart = 0;
  // for (let i = 0; i < string.length; i++) {
  //   const nicknameStart = string.indexOf('[[', stringStart) + 2;
  //   const nicknameEnd = string.indexOf(']]', nicknameStart);
  //   stringStart = nicknameEnd;
  //   const newNickname = string.slice(nicknameStart, nicknameEnd);
  //   console.log(newNickname)
  // }
};

console.log(parseUserNames(str))

export {
  getFirstInitial,
  getAvatarColor,
  parseUserNames,
};
