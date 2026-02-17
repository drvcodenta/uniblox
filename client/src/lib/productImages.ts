/**
 * Maps product IDs to their image assets.
 * Images are placed in /client/src/assets/ by the user.
 */

import wirelessMouse from '../assets/wireless-mouse.jpg';
import mechanicalKeyboard from '../assets/mechanical_keyboard.jpg';
import usbcHub from '../assets/usb-c-hub.jpg';
import monitorStand from '../assets/monitor_stand.webp';
import webcamHd from '../assets/webcam-hd.jpg';

const productImages: Record<string, string> = {
    p1: wirelessMouse,
    p2: mechanicalKeyboard,
    p3: usbcHub,
    p4: monitorStand,
    p5: webcamHd,
};

export default productImages;
