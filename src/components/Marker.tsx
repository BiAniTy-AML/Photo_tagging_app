import { FC, useEffect, useState } from "react";

interface Props {}

const Marker: FC<Props> = () => {
    const [active, set_active] = useState(false);
    let select_click = false;

    const [position, set_position] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

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

    const on_select_click = (e: MouseEvent): void => {
        if (!select_click) {
            set_position({ x: e.pageX, y: e.pageY });

            set_active(true);
            select_click = true;
            return;
        }

        set_position({ x: 0, y: 0 });

        set_active(false);
        select_click = false;
    };

    return (
        <>
            <div
                className={`marker ${active ? "active" : ""}`}
                style={{ left: position.x, top: position.y }}
            ></div>
        </>
    );
};

export default Marker;
