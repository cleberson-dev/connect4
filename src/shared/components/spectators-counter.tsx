import { EyeIcon } from "@heroicons/react/16/solid";
import { Tooltip } from "react-tooltip";

import { Spectator } from "@/shared/types";

type Props = {
  spectators: Spectator[];
};

export default function SpectatorsCounter({ spectators }: Props) {
  return (
    <>
      <div
        id="spectatorsCount"
        className="flex items-center text-xs gap-x-1"
        title={`${spectators.length} Spectators`}
      >
        <EyeIcon className="w-4 h-4" />
        <span>{spectators.length}</span>
      </div>
      <Tooltip anchorSelect="#spectatorsCount">
        <ul>
          {spectators.map((spectator) => (
            <li key={spectator.id}>{spectator.name}</li>
          ))}
        </ul>
      </Tooltip>
    </>
  );
}
