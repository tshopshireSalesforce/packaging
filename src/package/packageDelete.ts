/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Connection, SfProject } from '@salesforce/core';
import { combineSaveErrors, applyErrorAction, massageErrorMessage, validateId, BY_LABEL } from '../utils/packageUtils';
import { PackageSaveResult } from '../interfaces';

export async function deletePackage(
  idOrAlias: string,
  project: SfProject,
  connection: Connection,
  undelete: boolean
): Promise<PackageSaveResult> {
  const packageId = project.getPackageIdFromAlias(idOrAlias) ?? idOrAlias;
  validateId(BY_LABEL.PACKAGE_ID, packageId);

  const request = {} as { Id: string; IsDeprecated: boolean };
  request.Id = packageId;
  const isUndelete = undelete;
  request.IsDeprecated = !isUndelete;

  const updateResult = await connection.tooling.update('Package2', request).catch((err) => {
    throw applyErrorAction(massageErrorMessage(err as Error));
  });
  if (!updateResult.success) {
    throw combineSaveErrors('Package2', 'update', updateResult.errors);
  }
  return updateResult;
}
