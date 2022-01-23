import * as ffmpeg from 'fluent-ffmpeg';
import { platform } from 'os';
import * as path from 'path';
import * as fs from 'fs';

export class DashBuilder {
  constructor() {
    this.detectPlatform();
  }

  public encodeFormats(fn: string): void {
    // height, bitrate
    const sizes = [
      [240, 350],
      [480, 700],
      [720, 2500],
    ];
    const fallback = [480, 400];

    let name = path.basename(fn, path.extname(fn));
    const targetDir = path.dirname(fn); // path.join(__dirname, name);
    const sourceFn = path.resolve(fn);

    console.log('source', sourceFn);
    console.log('info', sizes);
    console.log('info', targetDir);

    // try {
    //   let targetDirInfo = fs.statSync(targetDir);
    // } catch (err) {
    //   if (err.code === 'ENOENT') {
    //     fs.mkdirSync(targetDir);
    //   } else {
    //     throw err;
    //   }
    // }

    let proc = ffmpeg({
      source: sourceFn,
      cwd: targetDir
    });

    let targetFn = path.join(targetDir, `${name}.mpd`);

    proc
      .output(targetFn)
      .format('dash')
      .videoCodec('libx264')
      .audioCodec('aac')
      .audioChannels(2)
      .audioFrequency(44100)
      .outputOptions([
        '-preset veryfast',
        '-keyint_min 60',
        '-g 60',
        '-sc_threshold 0',
        '-profile:v main',
        '-use_template 1',
        '-use_timeline 1',
        '-b_strategy 0',
        '-bf 1',
        '-map 0:a',
        '-b:a 96k'
      ]);

    for (let size of sizes) {
      let index = sizes.indexOf(size);

      proc
        .outputOptions([
          `-filter_complex [0]format=pix_fmts=yuv420p[temp${index}];[temp${index}]scale=-2:${size[0]}[A${index}]`,
          `-map [A${index}]:v`,
          `-b:v:${index} ${size[1]}k`,
        ]);
    }

    // Fallback version
    proc
      .output(path.join(targetDir, `${name}.mp4`))
      .format('mp4')
      .videoCodec('libx264')
      .videoBitrate(fallback[1])
      .size(`?x${fallback[0]}`)
      .audioCodec('aac')
      .audioChannels(2)
      .audioFrequency(44100)
      .audioBitrate(128)
      .outputOptions([
        '-preset veryfast',
        '-movflags +faststart',
        '-keyint_min 60',
        '-refs 5',
        '-g 60',
        '-pix_fmt yuv420p',
        '-sc_threshold 0',
        '-profile:v main',
      ]);

    proc.on('start', function(commandLine) {
      console.log('progress', 'Spawned Ffmpeg with command: ' + commandLine);
    });

    proc.on('progress', function(info) {
      console.log('progress', info);
    })
      .on('end', function() {
        console.log('complete');
      })
      .on('error', function(err) {
        console.log('error', err);
      });
    return proc.run();
  }

  private detectPlatform(): void {
    if (platform() === 'win32') {
      let binaryPath = path.join(__dirname, '../ffmpeg/bin/');
      let FfmpegPath = path.join(binaryPath, 'ffmpeg.exe');

      try {
        let FfmpegPathInfo = fs.statSync(FfmpegPath);
      } catch (err) {
        throw err;
      }

      ffmpeg.setFfmpegPath(FfmpegPath);
      ffmpeg.setFfprobePath(path.join(binaryPath, 'ffprobe.exe'));

      console.log('binaryPath', path.join(binaryPath, 'ffmpeg.exe'));
    }
  }
}
