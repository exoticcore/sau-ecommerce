import { AssignerProtocol, Kafka, PartitionAssigner } from 'kafkajs';

const kafka = new Kafka({
  brokers: ['localhost:9092'],
  clientId: 'product-producer',
});

export const producer = kafka.producer();

const ConsumerPartitionAssigner: PartitionAssigner[] = [
  ({ cluster }) => ({
    name: 'MyPartition',
    version: 1,
    protocol({ topics }) {
      return {
        name: this.name,
        metadata: AssignerProtocol.MemberMetadata.encode({
          version: this.version,
          topics,
          userData: Buffer.from([]),
        }),
      };
    },
    assign: async ({ members }) => {
      await cluster.connect();
      await cluster.refreshMetadata();

      return members.map((member) => ({
        memberId: member.memberId,
        memberAssignment: AssignerProtocol.MemberAssignment.encode({
          version: 1,
          assignment: { ['media.upload.image.category']: [1, 2] },
          userData: Buffer.from([]),
        }),
      }));
    },
  }),
];

export const consumer = kafka.consumer({
  groupId: 'product-consumer',
  partitionAssigners: ConsumerPartitionAssigner,
});
