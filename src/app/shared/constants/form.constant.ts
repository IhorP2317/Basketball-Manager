export const PASSWORD_PATTERN: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
export const NAME_PATTERN: RegExp = /^[a-zA-Z0-9\\s]+$/;

export const IMAGE_FORMAT_PATTERN: RegExp =
  /\.(jpe?g|png|ico|gif|bmp|tiff?|jtiff|xbm|svgz?|webp|avif)$/i;
