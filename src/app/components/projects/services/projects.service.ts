import { Injectable } from '@angular/core';
import { Project } from '../../../interfaces/projects';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor() {}

  getProjects(): Project[] {
    return [
      {
        name: 'Tricky Mansion',
        description:
          'A 2D platformer game developed in Unity. Features a random vertical scrolling level generation, various enemies and traps.',
        image: 'img/tricky-mansion.webp',
        url: 'https://play.google.com/store/apps/details?id=com.ChapayPinturaJorgeRal.TrickyMansion',
      },
      {
        name: 'PseudoBlocks',
        description:
          'Create simple programs using a visual interface with pseudocode blocks. Made from scratch in C# winforms.',
        image: 'img/pseudoblocks.webp',
        url: 'https://github.com/pablogozalvez/PseudoBlocks',
      },
      {
        name: 'Clumsy Mimics',
        description:
          'Game created for the fifth UJI Game Jam. Everything was created exclusively by our team, being completed in less than 48 hours.',
        image: 'img/clumsy-mimics.webp',
        url: 'https://github.com/pablogozalvez/ClumsyMimics',
      },
      {
        name: 'Scroll Carousel',
        description:
          'A Unity component for creating dynamic and interactive carousels in user interfaces - ideal for menus, galleries and more!',
        image: 'img/scroll-carousel.webp',
        url: 'https://github.com/pablogozalvez/ScrollCarousel',
      },
      {
        name: 'Super Mario Phaser',
        description:
          'Recreation of the classic Super Mario Bros game using the Phaser framework, featuring random level generation.',
        image: 'img/super-mario-phaser.webp',
        url: 'https://github.com/pablogozalvez/Super-Mario-Phaser',
      },
      {
        name: 'Space Invaders',
        description:
          'Console-based recreation of the classic Space Invaders game using C#.',
        image: 'img/space-invaders.webp',
        url: 'https://github.com/pablogozalvez/Space-Invaders',
      },
      {
        name: 'Joker Assistant',
        description:
          'A simple C# Winforms desktop assistant utilizing Microsoft SpeechRecognitionEngine for voice recognition and custom command execution.',
        image: 'img/joker-assistant.webp',
        url: 'https://github.com/pablogozalvez/Joker-Assistant',
      },
    ];
  }
}
