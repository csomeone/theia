/*
 * Copyright (C) 2017-2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { ContainerModule } from "inversify";
import { SearchInWorkspaceService, SearchInWorkspaceClientImpl } from './search-in-workspace-service';
import { SearchInWorkspaceServer } from '../common/search-in-workspace-interface';
import { WebSocketConnectionProvider, KeybindingContribution } from '@theia/core/lib/browser';
import { QuickSearchInWorkspace, SearchInWorkspaceContributions } from './quick-search-in-workspace';
import { CommandContribution, MenuContribution } from "@theia/core";

export default new ContainerModule(bind => {
    bind(QuickSearchInWorkspace).toSelf().inSingletonScope();

    bind(SearchInWorkspaceContributions).toSelf().inSingletonScope();
    bind(CommandContribution).toService(SearchInWorkspaceContributions);
    bind(MenuContribution).toService(SearchInWorkspaceContributions);
    bind(KeybindingContribution).toService(SearchInWorkspaceContributions);

    // The object that gets notified of search results.
    bind(SearchInWorkspaceClientImpl).toSelf().inSingletonScope();

    bind(SearchInWorkspaceService).toSelf().inSingletonScope();

    // The object to call methods on the backend.
    bind(SearchInWorkspaceServer).toDynamicValue(ctx => {
        const client = ctx.container.get(SearchInWorkspaceClientImpl);
        return WebSocketConnectionProvider.createProxy(ctx.container, '/search-in-workspace', client);
    }).inSingletonScope();
});
