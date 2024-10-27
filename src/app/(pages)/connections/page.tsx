'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { CONNECTIONS } from '@/lib/constants';
import ConnectionCard from './_components/Card';
import { Connection } from '@/lib/types';
import getConnections from '@/app/actions/getConnections';

function Connections() {
  const [connections, setConnections] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchConnections = useCallback(async () => {
    setIsFetching(true);
    const connections = await getConnections();
    setIsFetching(false);
    if (connections) {
      setConnections(connections);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const cachedConnections = useMemo(() => {
    return connections;
  }, [connections]);

  return (
    <div className="flex flex-wrap justify-start mx-[3vw]">
      {CONNECTIONS.map((connection: Connection, idx: number) => {
        return (
          <div key={idx} className="mx-1 my-3">
            <ConnectionCard
              connected={cachedConnections}
              type={connection.title}
              icon={connection.image}
              title={connection.title}
              description={connection.description}
              callback={fetchConnections}
              isFetching={isFetching}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Connections;
