/**
 * Training Page
 * Week 4 Day 5: Vendor training and education hub
 */

import { TrainingResources } from '../../components/vendor/TrainingResources';
import { VendorNavigation } from '../../components/vendor/VendorNavigation';

export function TrainingPage() {
  return (
    <div>
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <VendorNavigation />
      </div>
      {/* Content */}
      <TrainingResources />
    </div>
  );
}

export default TrainingPage;
