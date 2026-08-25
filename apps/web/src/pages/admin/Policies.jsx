import { Download, Upload, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';

/**
 * Policies — governance portal. Renders inside GovernanceLayout (shared
 * fixed sidebar + top bar); this file is content only. The policy list
 * itself is not built yet — the frame only draws the header row.
 */
export default function Policies() {
  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Policies</h1>
          <p className="text-base text-slate-600 mt-2 max-w-md">
            Manage policy versions, acknowledgements and governance references in a
            secure, structured space.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <Button variant="outline" icon={Download} className="w-auto! px-4! py-2.5!">
            Export metadata
          </Button>
          <Button variant="outline" icon={Upload} className="w-auto! px-4! py-2.5!">
            Upload version
          </Button>
          <Button variant="outline" icon={Plus} className="w-auto! px-4! py-2.5!">
            Add policy
          </Button>
        </div>
      </div>
    </div>
  );
}
