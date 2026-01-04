import { Note, Folder } from '../types';

// Define folders with their associated data directories
export const FOLDERS: Folder[] = [
  { id: 'biology', name: 'Biology 101', icon: 'biotech' },
  { id: 'history', name: 'World History', icon: 'history_edu' },
];

// Notes data organized by folder, derived from the markdown files in data/
const NOTES_BY_FOLDER: Record<string, Note[]> = {
  biology: [
    {
      id: 'bio-1',
      type: 'summary',
      title: 'Cell Structure and Organelles',
      subtitle: 'Comprehensive notes on cell biology',
      content: 'The cell is the basic unit of life. Understanding cell structure including the nucleus, mitochondria, endoplasmic reticulum, and other organelles is fundamental to biology. Prokaryotic cells lack a membrane-bound nucleus while eukaryotic cells contain various organelles.',
      date: '2h ago',
      tags: ['#cells', '#organelles'],
    },
    {
      id: 'bio-2',
      type: 'slides',
      title: 'Photosynthesis Diagrams',
      subtitle: 'Visual guide with chloroplast structure',
      content: 'Photosynthesis converts light energy into chemical energy. The process occurs in two stages: light-dependent reactions in thylakoids and the Calvin cycle in the stroma.',
      date: 'Yesterday',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Chloroplast_II.svg/800px-Chloroplast_II.svg.png',
      tags: ['#photosynthesis', '#diagrams'],
    },
    {
      id: 'bio-3',
      type: 'tasks',
      title: 'Genetics Study Plan',
      subtitle: '0/30 Completed',
      date: 'Oct 24',
      progress: {
        completed: 0,
        total: 30,
        items: [
          { label: 'Read Chapter 12: DNA Structure', done: false },
          { label: 'Watch video lecture on DNA double helix', done: false },
          { label: 'Complete DNA replication worksheet', done: false },
          { label: 'Memorize base pairing rules (A-T, G-C)', done: false },
          { label: 'Practice labeling DNA structure diagram', done: false },
        ],
      },
    },
    {
      id: 'bio-4',
      type: 'article',
      title: 'Evolution and Natural Selection',
      subtitle: 'Darwin\'s theory explained',
      content: 'Natural selection is the process by which organisms with favorable traits are more likely to survive and reproduce. The four conditions are: variation, inheritance, selection, and time. Evidence includes fossils, comparative anatomy, and molecular biology.',
      date: 'Oct 22',
      tags: ['#evolution', '#darwin'],
    },
    {
      id: 'bio-5',
      type: 'summary',
      title: 'Ecosystems and Ecology',
      subtitle: 'Study notes on ecological systems',
      content: 'Ecosystems consist of biotic (living) and abiotic (non-living) factors. Energy flows through trophic levels with only 10% transferred to the next level. Key cycles include carbon, nitrogen, and water cycles.',
      date: 'Oct 20',
      tags: ['#ecology', '#ecosystems'],
    },
  ],
  history: [
    {
      id: 'hist-1',
      type: 'article',
      title: 'Ancient Rome: Republic to Empire',
      subtitle: 'Comprehensive overview',
      content: 'Rome was founded in 753 BCE. The Republic featured the Senate, Assemblies, and Magistrates. The Punic Wars against Carthage expanded Roman territory. Julius Caesar\'s crossing of the Rubicon led to civil war and eventually Augustus becoming the first Emperor.',
      date: '3h ago',
      tags: ['#rome', '#ancient'],
    },
    {
      id: 'hist-2',
      type: 'slides',
      title: 'World War II Visual History',
      subtitle: 'Key events with historical photos',
      content: 'WWII (1939-1945) was the deadliest conflict in history. Key events include the invasion of Poland, Battle of Britain, Pearl Harbor, D-Day, and the atomic bombings of Hiroshima and Nagasaki.',
      date: 'Yesterday',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Into_the_Jaws_of_Death_23-0455M_edit.jpg/800px-Into_the_Jaws_of_Death_23-0455M_edit.jpg',
      tags: ['#ww2', '#photos'],
    },
    {
      id: 'hist-3',
      type: 'tasks',
      title: 'Industrial Revolution Research',
      subtitle: '0/52 Completed',
      date: 'Oct 24',
      progress: {
        completed: 0,
        total: 52,
        items: [
          { label: 'Visit library archives for original documents', done: false },
          { label: 'Find letters/diaries from factory workers', done: false },
          { label: 'Locate parliamentary records on labor laws', done: false },
          { label: 'Create thesis statement', done: false },
          { label: 'Draft introduction paragraph', done: false },
        ],
      },
    },
    {
      id: 'hist-4',
      type: 'article',
      title: 'The French Revolution',
      subtitle: '1789-1799 detailed analysis',
      content: 'The French Revolution transformed France from an absolute monarchy to a republic. Causes included economic crisis, Enlightenment ideas, and weak leadership. Key events: Storming of the Bastille, Declaration of Rights of Man, Reign of Terror, and Napoleon\'s rise.',
      date: 'Oct 22',
      tags: ['#france', '#revolution'],
    },
    {
      id: 'hist-5',
      type: 'summary',
      title: 'Civil Rights Movement',
      subtitle: 'American history study notes',
      content: 'The Civil Rights Movement fought to end racial discrimination. Key events include Brown v. Board of Education (1954), Montgomery Bus Boycott, March on Washington, and Selma. Leaders included MLK Jr., Rosa Parks, and John Lewis. Major legislation: Civil Rights Act 1964, Voting Rights Act 1965.',
      date: 'Oct 20',
      tags: ['#civilrights', '#america'],
    },
  ],
};

// Get all folders
export const getFolders = (): Folder[] => {
  return FOLDERS;
};

// Get notes for a specific folder
export const getNotesByFolder = (folderId: string): Note[] => {
  return NOTES_BY_FOLDER[folderId] || [];
};

// Get a single note by ID
export const getNoteById = (noteId: string): Note | undefined => {
  for (const folderNotes of Object.values(NOTES_BY_FOLDER)) {
    const note = folderNotes.find(n => n.id === noteId);
    if (note) return note;
  }
  return undefined;
};

// Get folder by ID
export const getFolderById = (folderId: string): Folder | undefined => {
  return FOLDERS.find(f => f.id === folderId);
};

// Get note count for a folder
export const getNoteCount = (folderId: string): number => {
  return NOTES_BY_FOLDER[folderId]?.length || 0;
};
