interface StagesInterface {
    1: Stage;
}

interface Stage {
    characters: string[];
    bg_img: {
        path: string;
        name: string;
    };
}

export type { Stage, StagesInterface };
