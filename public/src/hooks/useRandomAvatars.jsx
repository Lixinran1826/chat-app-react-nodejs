import { useState, useEffect } from 'react';
import multiavatar from '@multiavatar/multiavatar'; // 确保你已经安装了这个库

const generateRandomName = () => Math.random().toString(36).substring(2, 10);

function useRandomAvatars(count = 4) {
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateAvatars = () => {
      const data = [];
      for (let i = 0; i < count; i++) {
        const randomName = generateRandomName();
        const svgCode = multiavatar(randomName);
        const encoded = btoa(unescape(encodeURIComponent(svgCode)));
        data.push(encoded);
      }
      setAvatars(data);
      setIsLoading(false);
    };

    generateAvatars();
  }, [count]); // 当 count 变化时重新生成

  return { avatars, isLoading };
}

export default useRandomAvatars;