export const selectFile = e => {
  return new Promise((resolve, reject) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return reject('Upload a valid image.');
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        return resolve(event.target.result);
      };
    } else reject('Not a valid operation');
  });
};

export const validateProduct = obj => {
  for (const property in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, property)) {
      const value = obj[property];

      // Check if the value is empty
      if (value === null || value === undefined) {
        return true;
      }
      if (typeof value === 'string' && value.trim() === '') {
        return true;
      }
      if (Array.isArray(value) && value.length === 0) {
        return true;
      }
      if (typeof value === 'object' && Object.keys(value).length === 0) {
        return true;
      }
    }
  }

  return false;
};

export const addScroll = childElement => {
  const parent = childElement.parentElement;
  const exceeds = childElement.scrollWidth > parent.clientWidth;
  const leftButton = parent.querySelector('.left');
  const rightButton = parent.querySelector('.right');
  let bindEvent;

  const isScrollable = childElement.scrollWidth > childElement.clientWidth;

  if (exceeds && isScrollable) {
    let isMouseDown = false;
    let startX;
    let scrollLeft;

    const handleDrag = e => {
      if (!isMouseDown) return;
      const x = e.pageX - startX;
      childElement.scrollLeft = scrollLeft - x;
      updateButtonVisibility();
    };

    const handleMouseUp = () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleMouseUp);
      childElement.style.removeProperty('cursor');
      childElement.style.removeProperty('user-select');
    };
    bindEvent = e => {
      isMouseDown = true;
      startX = e.pageX;
      scrollLeft = childElement.scrollLeft;

      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleMouseUp);
      childElement.style.cursor = 'grabbing';
      childElement.style.userSelect = 'none';
    };

    childElement.addEventListener('mousedown', bindEvent);

    leftButton.addEventListener('click', () => {
      childElement.scrollBy({
        left: -60,
        behavior: 'smooth',
      });
      updateButtonVisibility();
    });

    rightButton.addEventListener('click', () => {
      childElement.scrollBy({
        left: 60,
        behavior: 'smooth',
      });
      updateButtonVisibility();
    });

    const updateButtonVisibility = () => {
      const maxScroll = childElement.scrollWidth - childElement.clientWidth;

      leftButton.style.opacity = childElement.scrollLeft > 0 ? 1 : 0;
      rightButton.style.opacity = childElement.scrollLeft < maxScroll ? 1 : 0;

      leftButton.style.pointerEvents = childElement.scrollLeft > 0 ? 'auto' : 'none';
      rightButton.style.pointerEvents = childElement.scrollLeft < maxScroll ? 'auto' : 'none';
    };

    updateButtonVisibility();
  }

  if (!isScrollable) {
    childElement.removeEventListener('mousedown', bindEvent);
    leftButton.style.opacity = 0;
    leftButton.style.pointerEvents = 'none';
    rightButton.style.opacity = 0;
    rightButton.style.pointerEvents = 'none';
  } else {
    rightButton.parentElement && (rightButton.parentElement.parentElement.height = childElement.clientHeight);
    rightButton.style.opacity = 1;
    rightButton.style.pointerEvents = 'auto';
  }

  window.addEventListener('resize', () => addScroll(childElement), { once: true });

  return isScrollable ? childElement.clientHeight : false;
};
export const scroll = y => {
  let scrollTo = y;
  if (y instanceof HTMLElement) {
    scrollTo = y.offsetTop;
  }
  if (scrollTo === window.scrollY) return;

  window.scrollBy({
    top: scrollTo,
    behavior: 'smooth',
  });
};

export const getShade = hexColor => {
  // Convert hex color to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Use black or white text based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};
