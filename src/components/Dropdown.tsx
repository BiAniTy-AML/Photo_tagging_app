import { FC, useEffect, useRef, useState } from "react";

interface Props {
    stage: {
        characters: string[];
    };
}

const Dropdown: FC<Props> = ({ stage }) => {
    const [position, set_position] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const [active, set_active] = useState(false);

    const options = useRef<HTMLDivElement>(null);

    useEffect(() => {
        add_event_listeners();

        return () => remove_event_listeners();
    }, []);

    const add_event_listeners = (): void => {
        document.addEventListener("click", on_select_click);
    };

    const remove_event_listeners = (): void => {
        document.removeEventListener("click", on_select_click);
    };

    const decide_position = (e: MouseEvent): { x: number; y: number } => {
        const vw = Math.max(
            document.documentElement.clientWidth || 0,
            window.innerWidth || 0
        );

        const vh = Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
        );

        const div_width = options.current!.offsetWidth;
        const div_height = options.current!.offsetHeight;

        let x = 0;
        let y = 0;

        // Checks if the "dropdown" will appear too close to the end of the screen
        switch (true) {
            case e.clientX + div_width + 40 >= vw &&
                e.clientY + div_height + 20 >= vh:
                x = e.clientX - (40 + div_width);
                y = e.clientY - (20 + div_height);
                break;

            // Too far left
            case e.clientX + div_width + 40 >= vw:
                x = e.clientX - (40 + div_width);
                y = e.clientY + 20;
                break;

            // Lower than the screen
            case e.clientY + div_height + 20 >= vh:
                x = e.clientX + 40;
                y = e.clientY - (20 + div_height);
                break;

            default:
                x = e.clientX + 40;
                y = e.clientY + 20;
                break;
        }

        return { x, y };
    };

    let is_visible = false;

    const on_select_click = (e: MouseEvent): void => {
        const coordinates = decide_position(e);

        if (!is_visible) {
            set_position(coordinates);

            set_active(true);
            is_visible = true;
            return;
        }

        set_position({ x: 0, y: 0 });

        is_visible = false;
        set_active(false);
    };

    const on_mouse_move = (e: MouseEvent): void => {
        const coordinates = decide_position(e);
        set_position(coordinates);
    };

    return (
        <div
            className={`characters_dropdown ${active ? "active" : ""}`}
            style={{ left: position.x, top: position.y }}
            ref={options}
        >
            <div data-value="option1" className="character_option">
                {stage.characters[0]}
            </div>
            <div data-value="option2" className="character_option">
                {stage.characters[1]}
            </div>
            <div data-value="option3" className="character_option">
                {stage.characters[2]}
            </div>
        </div>
    );
};

export default Dropdown;
