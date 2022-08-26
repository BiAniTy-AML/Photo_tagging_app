import {
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Stage } from "../Utils/Interfaces";

interface Props {
  stage: Stage;
  top_bar: RefObject<HTMLDivElement>;
  container: RefObject<HTMLDivElement>;
  set_current_state: Dispatch<SetStateAction<Stage>>;
}

const Dropdown: FC<Props> = ({
  stage,
  top_bar,
  container,
  set_current_state,
}) => {
  // The position of the dropdown
  const [position, set_position] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Rects for the top bar and the image container
  let top_rect: DOMRect | null;
  let cont_rect: DOMRect | null;

  // Whether it should be displayed or not
  const [active, set_active] = useState(false);

  // The dropdown element, containing the options to be selected
  const options = useRef<HTMLDivElement>(null);

  useEffect(() => {
    add_event_listeners();

    // Set the rects once the component mounts
    top_rect = top_bar.current!.getBoundingClientRect();
    cont_rect = container.current!.getBoundingClientRect();

    return () => remove_event_listeners();
  }, []);

  const add_event_listeners = (): void => {
    document.addEventListener("click", on_select_click);
  };

  const remove_event_listeners = (): void => {
    document.removeEventListener("click", on_select_click);
  };

  // Function for deciding the position of the div
  // gonna change it later
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
      case e.pageX + div_width + 40 >= vw && e.pageY + div_height + 20 >= vh:
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

  // Another variable to indicate if it should be displayed
  // It's here because setState is async, so checking for the state variable
  // does not work
  let is_visible = false;

  let selected_coords: { x: number; y: number };

  // When clicking on the page
  const on_select_click = (e: MouseEvent): void => {
    const target = e.target as HTMLDivElement;

    if (target === options.current) return;

    const coordinates = decide_position(e);

    // The coordinates of where the user clicked relative to the image container
    let bg_x: number = e.pageX - cont_rect!.left;
    let bg_y: number = e.pageY - cont_rect!.top;

    // Should not activate if clicked in the top bar
    const border = top_rect!.bottom;

    if (e.pageY <= border) return;

    // If dropdown is not visible
    if (!is_visible) {
      // Save where it was clicked
      selected_coords = { x: bg_x, y: bg_y };

      set_position(coordinates);

      // Makes it appear
      set_active(true);
      is_visible = true;
      return;
    }

    // Otherwise,

    set_position({ x: 0, y: 0 });

    // Makes it disappear
    is_visible = false;
    set_active(false);

    // Gets the options the user selected
    if (target.classList.contains("option")) {
      const option = target.textContent;

      // Find the corresponding target in the stage object
      const target_obj =
        stage.targets.find(({ name }) => name === option) || null;

      if (!target_obj) return;

      // Find where the target is in the array
      const index = stage.targets.indexOf(target_obj);

      const targets = stage.targets;
      targets[index] = target_obj;

      // If the selected location is within the acceptable answers for the target
      // and the target has not been found yet
      if (
        selected_coords.x >= target_obj.answers.min_x &&
        selected_coords.x <= target_obj.answers.max_x &&
        selected_coords.y >= target_obj.answers.min_y &&
        selected_coords.y <= target_obj.answers.max_y &&
        !target_obj.found
      ) {
        // Set the target as found
        target_obj.found = true;

        alert(`You found ${target_obj.name}!`);

        // Updates the stage state so the components change
        set_current_state((prev_stage) => {
          return {
            ...prev_stage,
          };
        });

        // Alerts the user if all of the targets were found
        const found_all = stage.targets.every(({ found }) => found);
        if (found_all) alert("You found all of them! Congrats!!!");
      }
    }
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
