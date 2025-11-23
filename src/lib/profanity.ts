const BAD_WORDS = [
    // English
    'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'whore', 'slut', 'bastard',
    // Indonesian
    'anjing', 'babi', 'monyet', 'bangsat', 'kontol', 'memek', 'jembut', 'ngentot', 'tolol', 'goblok', 'bodoh', 'pantek', 'perek', 'lonte'
];

export function isProfane(text: string): boolean {
    const lower = text.toLowerCase();
    return BAD_WORDS.some(word => lower.includes(word));
}
