import { FC, RefObject, useEffect, useRef, useState } from "react";
import { Stage } from "../Utils/Interfaces";

interface Props {
    stage: Stage;
    top_bar: RefObject<HTMLDivElement>;
}

const Dropdown: FC<Props> = ({ stage, top_bar }) => {
    const [position, set_position] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    let top_rect: DOMRect | null;

    const [active, set_active] = useState(false);

    const options = useRef<HTMLDivElement>(null);

    useEffect(() => {
        add_event_listeners();
        top_rect = top_bar.current!.getBoundingClientRect();

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
            case e.pageX + div_width + 40 >= vw &&
                e.pageY + div_height + 20 >= vh:
                x = e.pageX - (40 + div_width);
                y = e.pageY - (20 + div_height);
                break;

            // Too far left
            case e.pageX + div_width + 40 >= vw:
                x = e.pageX - (40 + div_width);
                y = e.pageY + 20;
                break;

            // Lower than the screen
            case e.pageY + div_height + 20 >= vh:
                x = e.pageX + 40;
                y = e.pageY - (20 + div_height);
                break;

            default:
                x = e.pageX + 40;
                y = e.pageY + 20;
                break;
        }

        return { x, y };
    };

    let is_visible = false;

    const on_select_click = (e: MouseEvent): void => {
        const target = e.target as HTMLDivElement;

        if (target === options.current) return;

        const coordinates = decide_position(e);

        if (!is_visible) {
            const border = top_rect!.bottom + window.scrollY;

            if (e.pageY >= border) set_position(coordinates);

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
        <>
            <div
                className={`characters_dropdown ${active ? "active" : ""}`}
                style={{ left: position.x, top: position.y }}
                ref={options}
            >
                {" "}
                {stage.targets.map((target, i) => (
                    <div data-value={`option${i}`} className="option" key={i}>
                        {target.name}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Dropdown;
