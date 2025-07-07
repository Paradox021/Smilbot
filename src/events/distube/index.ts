import { addSong } from './addSong';
import { deleteQueue } from './deleteQueue';
import { error } from './error';
import { ffmpegDebug } from './ffmpegDebug';
import { finish } from './finish';
import { playSong } from './playSong';

/**
 * Array with all the DisTube events
 */
export const distubeEvents = [
    addSong,
    deleteQueue,
    error,
    ffmpegDebug,
    finish,
    playSong
];