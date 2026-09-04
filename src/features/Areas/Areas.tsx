import { AREAS } from '../../lib/areas';
import { AreaCard } from './AreaCard';

export function Areas() {
  return (
    <div className="cats">
      {AREAS.map((area) => (
        <AreaCard key={area.id} area={area} />
      ))}
    </div>
  );
}
